const userRepository = require('../repositories/user.repository');
const baseResponse = require('../utils/baseResponse');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userRepository.getAllUsers();
        baseResponse(res, true, 200, 'Users fetched successfully', users);
    } catch (error) {
        console.error('Error fetching users:', error);
        baseResponse(res, false, 500, 'Internal server error');
    }
}