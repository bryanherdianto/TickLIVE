const userRepository = require('../repositories/user.repository');
const baseResponse = require('../utils/baseResponse');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{10,}$/;

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userRepository.getAllUsers();
        baseResponse(res, true, 200, 'Users fetched successfully', users);
    } catch (error) {
        console.error('Error fetching users:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}

exports.getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await userRepository.getUserbyId(userId);
        if (!user) {
            return baseResponse(res, false, 404, 'User not found');
        }
        baseResponse(res, true, 200, 'User fetched successfully', user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}

exports.userRegister = async (req, res) => {
    const { username, email, password, status } = req.body;
    if (!emailRegex.test(email)) {
        return baseResponse(res, false, 400, 'Invalid email format');
    }
    if (!passwordRegex.test(password)) {
        return baseResponse(res, false, 400, 'Password must be at least 10 characters, include a number and a symbol');
    }
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const existingEmail = await userRepository.getUserbyId(email);
        if (existingEmail) {
            return baseResponse(res, false, 409, 'Email already used');
        }
        const newUser = await userRepository.userRegister({ username, email, hashedPassword, status });
        baseResponse(res, true, 201, 'User registered successfully', newUser);
    } catch (error) {
        console.error('Error registering user:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}

exports.userLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!emailRegex.test(email)) {
        return baseResponse(res, false, 400, 'Invalid email format');
    }
    if (!passwordRegex.test(password)) {
        return baseResponse(res, false, 400, 'Password must be at least 10 characters, include a number and a symbol');
    }
    try {
        const user = await userRepository.userLogin(email, password);
        if (!user) {
            return baseResponse(res, false, 401, 'Invalid email or password');
        }
        baseResponse(res, true, 200, 'User logged in successfully', user);
    } catch (error) {
        console.error('Error logging in user:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}

exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, email, password, status } = req.body;
    if (!emailRegex.test(email)) {
        return baseResponse(res, false, 400, 'Invalid email format');
    }
    if (!passwordRegex.test(password)) {
        return baseResponse(res, false, 400, 'Password must be at least 10 characters, include a number and a symbol');
    }
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const updatedUser = await userRepository.updateUser(userId, { username, email, hashedPassword, status });
        if (!updatedUser) {
            return baseResponse(res, false, 404, 'User not found');
        }
        baseResponse(res, true, 200, 'User updated successfully', updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await userRepository.deleteUser(userId);
        if (!deletedUser) {
            return baseResponse(res, false, 404, 'User not found');
        }
        baseResponse(res, true, 200, 'User deleted successfully', deletedUser);
    } catch (error) {
        console.error('Error deleting user:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}