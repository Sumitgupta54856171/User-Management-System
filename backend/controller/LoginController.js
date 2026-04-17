const User = require('../model/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt with email:', req.body);

    // 1. Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide both email and password' 
      });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account has been deactivated. Please contact the administrator.' 
      });
    }

    // 4. Verify password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // 5. Generate JWT Token
    // Token payload me hum user ki ID aur Role daal rahe hain (RBAC ke liye zaroori hai)
    const payload = {
      id: user._id,
      role: user.role
    };

    // process.env.JWT_SECRET me apna secret key define karna na bhoolein
    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'fallback_secret_key_for_dev', 
      { expiresIn: '1d' } // Token 1 din ke liye valid rahega
    );

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };

 

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token: token,
      user: userData
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error during login: ' + error.message 
    });
  }
};