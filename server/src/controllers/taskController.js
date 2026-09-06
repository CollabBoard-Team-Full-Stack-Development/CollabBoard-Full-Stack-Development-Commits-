const Task = require('../models/Task');
const Activity = require('../models/Activity');

// GET /api/tasks
const getTasks = (req, res, next) => {
    try {
        const {
            projectId
        } = req.query;

        const tasks = Task.findAll(
            projectId || null
        );

        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

// GET /api/tasks/:id
const getTaskById = (req, res, next) => {
    try {
        const task = Task.findById(
            req.params.id
        );

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

// POST /api/tasks
const createTask = (req, res, next) => {
    try {
        const {
            projectId,
            title,
            description,
            status,
            priority,
            dueDate,
            assignees
        } = req.body;

        if (!title || !projectId) {
            return res.status(400).json({
                message:
                    'Task title and projectId are required'
            });
        }

        const newTask = Task.create({
            projectId,
            title,
            description,
            status,
            priority,
            dueDate,
            assignees
        });

        Activity.create(
            req.user?.name,
            'created task',
            title
        );

        res.status(201).json(newTask);
    } catch (error) {
        next(error);
    }
};

// PATCH /api/tasks/:id
const updateTask = (req, res, next) => {
    try {
        const task = Task.findById(
            req.params.id
        );

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        const oldStatus = task.status;

        const updatedTask = Task.update(
            req.params.id,
            req.body
        );

        if (
            req.body.status &&
            req.body.status !== oldStatus
        ) {
            Activity.create(
                req.user?.name,
                'moved task',
                `${updatedTask.title} to ${updatedTask.status}`
            );
        } else {
            Activity.create(
                req.user?.name,
                'updated task',
                updatedTask.title
            );
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
};

// DELETE /api/tasks/:id
const deleteTask = (req, res, next) => {
    try {
        const removed = Task.delete(
            req.params.id
        );

        if (!removed) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        Activity.create(
            req.user?.name,
            'deleted task',
            removed.title
        );

        res.status(200).json({
            message:
                'Task deleted successfully',
            id: req.params.id
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};