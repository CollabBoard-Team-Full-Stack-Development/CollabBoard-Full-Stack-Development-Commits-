const mongoose = require('mongoose');

const User = require('../models/User');
const Activity = require('../models/Activity');

const sanitizeUser = (user) => {
    if (!user) return null;

    const obj = user.toObject ? user.toObject() : user;
    const { passwordHash, ...safeUser } = obj;

    return {
        ...safeUser,
        id: safeUser._id
            ? safeUser._id.toString()
            : safeUser.id
    };
};

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort({ name: 1 });

        res.status(200).json(users.map(sanitizeUser));
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid user ID.'
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json(sanitizeUser(user));
    } catch (error) {
        next(error);
    }
};

// Update currently logged-in user's profile and save to MongoDB database
const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name, avatar, bio, department, jobTitle } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...(name && { name }),
                ...(avatar !== undefined && { avatar }),
                ...(bio !== undefined && { bio }),
                ...(department !== undefined && { department }),
                ...(jobTitle !== undefined && { jobTitle })
            },
            { new: true, runValidators: true }
        ).select('-passwordHash');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await Activity.create({
            user: userId,
            action: 'updated profile settings',
            target: updatedUser.name
        });

        res.status(200).json({
            success: true,
            user: sanitizeUser(updatedUser)
        });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid user ID.'
            });
        }

        const {
            passwordHash,
            _id,
            id,
            ...updates
        } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        await Activity.create({
            user: req.user.id,
            action: 'updated user profile',
            target: user.name
        });

        res.status(200).json(sanitizeUser(user));
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid user ID.'
            });
        }

        const removed = await User.findByIdAndDelete(req.params.id);

        if (!removed) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        await Activity.create({
            user: req.user.id,
            action: 'deactivated user',
            target: removed.name
        });

        res.status(200).json({
            message: 'User removed successfully',
            id: req.params.id
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateProfile,
    updateUser,
    deleteUser
};