const User = require('../model/usermodel');

const updateBasicDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, status } = req.body;
    console.log(req.body)

    let updateFields = {};

    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    
    if (status && req.user.role !== 'User') {
      updateFields.status = status;
    }

    updateFields.updatedBy = req.user ? req.user.id : null;

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

    res.status(200).json({
      success: true,
      message: 'User basic details updated successfully',
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

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;
    console.log(req.body)

  
    let updateFields = {};

    if (name) updateFields.name = name;
    if (email) updateFields.email = email;

    updateFields.updatedBy = req.user.id;

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