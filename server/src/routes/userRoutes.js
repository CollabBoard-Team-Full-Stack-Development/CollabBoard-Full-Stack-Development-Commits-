const express = require('express');

const {
    getUsers,
    getUserById,
    updateProfile,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const {
    authMiddleware,
    adminMiddleware
} = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getUsers);
router.get('/:id', getUserById);

// Dedicated route for updating current user's database profile
router.patch('/profile', updateProfile);

router.patch(
    '/:id',
    updateUser
);

router.delete(
    '/:id',
    adminMiddleware,
    deleteUser
);

module.exports = router;