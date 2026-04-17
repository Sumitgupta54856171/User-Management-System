const User = require('../model/usermodel')
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/email'); 

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;
    console.log('Creating user with data:', req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'User',
      status: status || 'active',
      createdBy: req.user ? req.user.id : null
    });

    try {
      const emailSubject = 'Welcome to Our Platform - Your Account Details';
      const emailText = `Hello ${name},\n\nYour account has been successfully created. Here are your login details:\n\nName: ${name}\nEmail: ${email}\nRole: ${role || 'User'}\nPassword: ${password}\n\nPlease log in and change your password as soon as possible for security reasons.\n\nThanks!`;
      
      await sendEmail(email, null, emailSubject, emailText);
      
      res.status(201).json({
        success: true,
        message: 'User created and email sent successfully',
        data: newUser
      });
    } catch (emailError) {
      console.error('Email sending failed, but user was created:', emailError.message);
      res.status(201).json({
        success: true,
        message: 'User created successfully (email notification failed)',
        data: newUser
      });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating user: ' + error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    let updateData = req.body;
    console.log('Updating user with ID:', userId, 'and data:', updateData);

    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.user.role === 'Manager' && userToUpdate.role === 'Admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Managers are not allowed to modify admin profiles' 
      });
    }

    if (req.user.role === 'Manager' && updateData.role === 'Admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Managers are not allowed to assign Admin role' 
      });
    }

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    updateData.updatedBy = req.user ? req.user.id : null;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { 
      new: true, 
      runValidators: true 
    });

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user: ' + error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('Deleting user with ID:', userId);

    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.user.role === 'Manager' && userToDelete.role === 'Admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Managers are not allowed to delete admin profiles' 
      });
    }

    if (userId === req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'You cannot delete your own account' 
      });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting user: ' + error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users: ' + error.message });
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers
};