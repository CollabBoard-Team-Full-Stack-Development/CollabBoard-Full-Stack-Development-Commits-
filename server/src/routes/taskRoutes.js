const express = require('express');

const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');

const {
    authMiddleware
} = require('../middleware/authMiddleware');

const router = express.Router();

// All task endpoints require authentication
router.use(authMiddleware);

router.get('/', getTasks);

router.get('/:id', getTaskById);

router.post('/', createTask);

router.patch('/:id', updateTask);

router.delete('/:id', deleteTask);

module.exports = router;