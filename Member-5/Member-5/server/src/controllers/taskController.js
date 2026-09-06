const mongoose = require('mongoose');

const Task = require('../models/Task');
const Activity = require('../models/Activity');

const serializeTask = (task) => {
    const obj = task.toObject();
    const { _id, projectId, assignees, ...rest } = obj;

    return {
        ...rest,
        id: _id.toString(),
        projectId: projectId?._id
            ? projectId._id.toString()
            : projectId?.toString(),
        assignees: Array.isArray(assignees)
            ? assignees.map((assignee) =>
                  assignee?._id
                      ? assignee._id.toString()
                      : assignee?.toString()
              )
            : []
    };
};

const getTasks = async (req, res, next) => {
    try {
        const { projectId } = req.query;
        const filter = {};

        if (projectId) {
            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                return res.status(400).json({
                    message: 'Invalid project ID'
                });
            }

            filter.projectId = projectId;
        }

        const tasks = await Task.find(filter)
            .populate('assignees', 'name email avatar role jobTitle')
            .sort({ createdAt: -1 });

        res.status(200).json(tasks.map(serializeTask));
    } catch (error) {
        next(error);
    }
};

const getTaskById = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid task ID'
            });
        }

        const task = await Task.findById(req.params.id).populate(
            'assignees',
            'name email avatar role jobTitle'
        );

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        res.status(200).json(serializeTask(task));
    } catch (error) {
        next(error);
    }
};

const createTask = async (req, res, next) => {
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
                message: 'Task title and projectId are required'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                message: 'Invalid project ID'
            });
        }

        const task = await Task.create({
            projectId,
            title,
            description: description || '',
            status: status || 'To Do',
            priority: priority || 'Medium',
            dueDate,
            assignees: Array.isArray(assignees) ? assignees : []
        });

        await Activity.create({
            user: req.user.id,
            action: 'created task',
            target: title
        });

        const populated = await Task.findById(task._id).populate(
            'assignees',
            'name email avatar role jobTitle'
        );

        res.status(201).json(serializeTask(populated));
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid task ID'
            });
        }

        const existingTask = await Task.findById(req.params.id);

        if (!existingTask) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        const oldStatus = existingTask.status;
        const { _id, id, ...updates } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        ).populate('assignees', 'name email avatar role jobTitle');

        if (req.body.status && req.body.status !== oldStatus) {
            await Activity.create({
                user: req.user.id,
                action: 'moved task',
                target: updatedTask.title,
                from: oldStatus,
                to: updatedTask.status
            });
        } else {
            await Activity.create({
                user: req.user.id,
                action: 'updated task',
                target: updatedTask.title
            });
        }

        res.status(200).json(serializeTask(updatedTask));
    } catch (error) {
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid task ID'
            });
        }

        const removed = await Task.findByIdAndDelete(req.params.id);

        if (!removed) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        await Activity.create({
            user: req.user.id,
            action: 'deleted task',
            target: removed.title
        });

        res.status(200).json({
            message: 'Task deleted successfully',
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