const userController = require('../controllers/user.controller');
const express = require('express');
const router = express.Router();

// Route to get all users
router.get('/', userController.getAllUsers);