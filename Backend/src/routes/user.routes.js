const userController = require('../controllers/user.controller');
const express = require('express');
const router = express.Router();

// Route to get all users
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);

module.exports = router;