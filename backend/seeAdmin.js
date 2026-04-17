const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./model/usermodel'); // Apne User model ka sahi path daalein
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Database se connect karein
    await mongoose.connect('mongodb://localhost:27017/user_management');
    console.log('Connected to Database');

    // Check karein ki kya admin pehle se hai
    const adminExists = await User.findOne({ email: 'admin@system.com' });
    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit();
    }

    // Password hash karein
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    // Admin create karein
    await User.create({
      name: 'Super Admin',
      email: 'admin@system.com',
      password: hashedPassword,
      role: 'Admin',
      status: 'active'
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@system.com | Password: Admin@123');
    process.exit();

  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();