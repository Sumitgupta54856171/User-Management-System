const express = require('express');
const router = require('express').Router();

const {protect} = require('../middleware/authMiddleware')

const AdminController = require('../controller/AdminController')
const {authorizeRoles} = require('../middleware/rolecheckMiddleware')
const { createUser, updateUser, deleteUser, getAllUsers } = AdminController;
const { updateProfile } = require('../controller/UserController');

router.delete(
  '/:id', 
  protect, 
  authorizeRoles('Admin', 'Manager'), 
  deleteUser
);

router.post(
  '/add', 
  protect, 
  authorizeRoles('Admin'), 
  createUser
);

router.get(
  '/', 
  protect, 
  authorizeRoles('Admin', 'Manager'), 
  getAllUsers
);

router.put(
  '/:id', 
  protect, 
  authorizeRoles('Admin', 'Manager'), 
  updateUser
);

router.put('/profile', protect, updateProfile);

module.exports = router;