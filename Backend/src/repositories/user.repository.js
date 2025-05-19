const db = require('../database/pg.database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.getAllUsers = async () => {
    try {
        const res = await db.query('SELECT * FROM users');
        return res.rows;
    }
    catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

exports.getUserbyId = async (userId) => {
    try {
        const res = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        return res.rows[0];
    }
    catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
}

exports.userRegister = async (userData) => {
    try {
        const { username, email, password, status } = userData;
        const res = await db.query('INSERT INTO users (username, email, password, status) VALUES ($1, $2, $3, $4) RETURNING *', [username, email, password, status]);
        return res.rows[0];
    }
    catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}

exports.userLogin = async (email, password) => {
    try {
        const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (res.rows.length === 0) {
            return null;
        }
        const user = res.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return null;
        }
        return user;
    }
    catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
}

exports.updateUser = async (userId, userData) => {
    try {
        const { username, email, password, status } = userData;
        const res = await db.query('UPDATE users SET username = $1, email = $2, password = $3, status = $4 WHERE id = $5 RETURNING *', [username, email, password, status, userId]);
        return res.rows[0];
    }
    catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

exports.deleteUser = async (userId) => {
    try {
        const res = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
        return res.rows[0];
    }
    catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}