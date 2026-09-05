const User = require('../models/User');
const Activity = require('../models/Activity');

// GET /api/users
const getUsers = (req, res, next) => {
    try {
        const safeUsers = User.findAll().map(
            ({
                passwordHash,
                ...user
            }) => user
        );

        res.status(200).json(safeUsers);
    } catch (error) {
        next(error);
    }
};

// GET /api/users/:id
const getUserById = (req, res, next) => {
    try {
        const user = User.findById(
            req.params.id
        );

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const {
            passwordHash,
            ...safeUser
        } = user;

        res.status(200).json(safeUser);
    } catch (error) {
        next(error);
    }
};

// PATCH /api/users/:id
const updateUser = (req, res, next) => {
    try {
        const {
            passwordHash,
            ...updates
        } = req.body;

        const user = User.update(
            req.params.id,
            updates
        );

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        Activity.create(
            req.user?.name,
            'updated user profile',
            user.name
        );

        const {
            passwordHash: _,
            ...safeUser
        } = user;

        res.status(200).json(safeUser);
    } catch (error) {
        next(error);
    }
};

// DELETE /api/users/:id
const deleteUser = (req, res, next) => {
    try {
        const removed = User.delete(
            req.params.id
        );

        if (!removed) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        Activity.create(
            req.user?.name,
            'deactivated user',
            removed.name
        );

        res.status(200).json({
            message:
                'User removed successfully',
            id: req.params.id
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};