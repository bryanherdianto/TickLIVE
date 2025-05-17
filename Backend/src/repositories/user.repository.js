const db = require('../database/pg.database');

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