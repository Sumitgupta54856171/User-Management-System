const User = require('../model/usermodel');

const updateBasicDetails = async (req, res) => {
  try {
    const userId = req.params.id; // URL se user ID milegi
    const { name, email, status } = req.body; // Frontend se aane wala data

    // 1. Ek empty object banayenge update ke liye
    let updateFields = {};

    // 2. Sirf wahi fields add karenge jo req.body me aayi hain
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    
    // Security Check: Status sirf Admin ya Manager change kar sake
    // Agar regular User khud update kar raha hai, toh status ignore ho jayega
    if (status && req.user.role !== 'User') {
      updateFields.status = status;
    }

    // Audit trail ke liye set kar rahe hain ki kisne update kiya
    updateFields.updatedBy = req.user ? req.user.id : null;

    // 3. Database me update query chalana
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields }, // $set sirf specific fields ko touch karta hai
      { 
        new: true, // true ka matlab naya updated data return karega
        runValidators: true // Schema validations (jaise unique email) check karega
      }
    ).select('-password'); // Password hash ko response se hide kar diya

    // 4. Agar user nahi mila
    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // 5. Success Response
    res.status(200).json({
      success: true,
      message: 'User basic details updated successfully',
      data: updatedUser
    });

  } catch (error) {
    // Agar email pehle se kisi aur ka hai, toh MongoDB duplicate key error (11000) dega
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'This email is already in use by another account' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server Error: ' + error.message 
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Logged in user ka ID
    const { name, email } = req.body; // Sirf name aur email allow karenge

    // 1. Empty object banayenge update ke liye
    let updateFields = {};

    // 2. Fields add karenge
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;

    // Audit trail
    updateFields.updatedBy = req.user.id;

    // 3. Database update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { 
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // 4. Success Response
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'This email is already in use by another account' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server Error: ' + error.message 
    });
  }
};

module.exports = { updateBasicDetails, updateProfile };