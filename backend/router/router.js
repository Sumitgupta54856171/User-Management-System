const express = require('express');
const router = require('express').Router();

const {protect} = require('../middleware/authMiddleware')

const AdminController = require('../controller/AdminController')
const {authorizeRoles} = require('../middleware/rolecheckMiddleware')
const { createUser, updateUser, deleteUser, getAllUsers } = AdminController;
const { updateProfile, updateBasicDetails } = require('../controller/UserController');

router.post(
  '/add', 
  protect, 
  authorizeRoles('Admin'), 
  createUser
);

router.put('/profile', protect, updateProfile);
router.put('/:id/basic', protect, updateBasicDetails);

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

router.delete(
  '/:id', 
  protect, 
  authorizeRoles('Admin', 'Manager'), 
  deleteUser
);

module.exports = router;