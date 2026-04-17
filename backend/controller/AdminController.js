const User = require('../model/usermodel')
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/email'); 

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;
    console.log('Creating user with data:', req.body);

    // Check agar user pehle se exist karta hai
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Password Hash karna
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Naya user create karna
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'User',
      status: status || 'active',
      createdBy: req.user ? req.user.id : null // Agar admin logged in hai
    });

    // Email bhejne ka logic (optional - agar fail ho toh user creation rokna nahi)
    try {
      const emailSubject = 'Welcome to Our Platform - Your Account Details';
      const emailText = `Hello ${name},\n\nYour account has been successfully created. Here are your login details:\n\nName: ${name}\nEmail: ${email}\nRole: ${role || 'User'}\nPassword: ${password}\n\nPlease log in and change your password as soon as possible for security reasons.\n\nThanks!`;
      
      // sendEmail function me 'otp' parameter null bhej rahe hain kyunki yahan zaroorat nahi hai
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

// ==========================
// 2. UPDATE USER
// ==========================
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    let updateData = req.body;
    console.log('Updating user with ID:', userId, 'and data:', updateData);

    // Get the user being updated
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the current user is a manager and trying to update an admin
    if (req.user.role === 'Manager' && userToUpdate.role === 'Admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Managers are not allowed to modify admin profiles' 
      });
    }

    // Managers cannot change user roles to Admin
    if (req.user.role === 'Manager' && updateData.role === 'Admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Managers are not allowed to assign Admin role' 
      });
    }

    // Agar update me naya password aa raha hai, toh use bhi hash karna padega
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

// ==========================
// 3. DELETE USER
// ==========================
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('Deleting user with ID:', userId);

    // Get the user being deleted
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the current user is a manager and trying to delete an admin
    if (req.user.role === 'Manager' && userToDelete.role === 'Admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Managers are not allowed to delete admin profiles' 
      });
    }

    // Prevent users from deleting themselves
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

// ==========================
// 4. UPDATE PROFILE (User can update their own profile)
// ==========================
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Get current user's ID from auth middleware
    let updateData = req.body;
    console.log('Updating profile for user ID:', userId, 'with data:', updateData);

    // Get the current user
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Users can only update their own name and email
    // They cannot change their role or status through profile update
    const allowedUpdates = ['name', 'email'];
    const actualUpdateData = {};
    
    for (const key of allowedUpdates) {
      if (updateData[key] !== undefined) {
        actualUpdateData[key] = updateData[key];
      }
    }

    // Check if email is being changed and if it's already taken
    if (actualUpdateData.email && actualUpdateData.email !== currentUser.email) {
      const existingUser = await User.findOne({ email: actualUpdateData.email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
    }

    actualUpdateData.updatedBy = userId;

    const updatedUser = await User.findByIdAndUpdate(userId, actualUpdateData, { 
      new: true, 
      runValidators: true 
    }).select('-password'); // Exclude password from response

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating profile: ' + error.message });
  }
};

// ==========================
// 5. GET ALL USERS
// ==========================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Password exclude karo
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
  updateProfile,
  getAllUsers
};