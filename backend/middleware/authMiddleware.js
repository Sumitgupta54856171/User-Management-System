const jwt = require('jsonwebtoken');
const User = require('../model/usermodel');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // "Bearer eyJhbGci..." is string ko split karke sirf token nikal rahe hain
      token = req.headers.authorization.split(' ')[1];

      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
         return res.status(401).json({ success: false, message: 'User not found' });
      }

      
      next(); 

    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  // Agar header me token tha hi nahi
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };