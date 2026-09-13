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
            assignees: Array.isArray(assignees) ? assignees : [],
            version: 0
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

        const serialized = serializeTask(populated);

        if (req.app.get('io')) {
            req.app.get('io').to(`project:${projectId}`).emit('task_created', serialized);
        }

        res.status(201).json(serialized);
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

        const { version, _id, id, ...updates } = req.body;

        if (version !== undefined && version !== null) {
            const existing = await Task.findById(req.params.id);
            if (!existing) {
                return res.status(404).json({
                    message: 'Task not found'
                });
            }

            if (existing.version !== Number(version)) {
                const currentTaskSerialized = serializeTask(existing);
                return res.status(409).json({
                    message: 'Task was modified by another user. Please review the latest version.',
                    code: 'TASK_CONFLICT',
                    currentTask: currentTaskSerialized
                });
            }
        }

        const existingTask = await Task.findById(req.params.id);
        if (!existingTask) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        const oldStatus = existingTask.status;

        const updateQuery = {
            $set: updates,
            $inc: { version: 1 }
        };

        let updatedTask;
        if (version !== undefined && version !== null) {
            updatedTask = await Task.findOneAndUpdate(
                { _id: req.params.id, version: Number(version) },
                updateQuery,
                { new: true, runValidators: true }
            ).populate('assignees', 'name email avatar role jobTitle');

            if (!updatedTask) {
                const latestTask = await Task.findById(req.params.id).populate('assignees', 'name email avatar role jobTitle');
                return res.status(409).json({
                    message: 'Task was modified by another user. Please review the latest version.',
                    code: 'TASK_CONFLICT',
                    currentTask: latestTask ? serializeTask(latestTask) : null
                });
            }
        } else {
            updatedTask = await Task.findByIdAndUpdate(
                req.params.id,
                updateQuery,
                { new: true, runValidators: true }
            ).populate('assignees', 'name email avatar role jobTitle');
        }

        const serialized = serializeTask(updatedTask);
        const projectIdStr = updatedTask.projectId.toString();

        if (req.body.status && req.body.status !== oldStatus) {
            await Activity.create({
                user: req.user.id,
                action: 'moved task',
                target: updatedTask.title,
                from: oldStatus,
                to: updatedTask.status
            });
            if (req.app.get('io')) {
                req.app.get('io').to(`project:${projectIdStr}`).emit('task_moved', serialized);
            }
        } else {
            await Activity.create({
                user: req.user.id,
                action: 'updated task',
                target: updatedTask.title
            });
            if (req.app.get('io')) {
                req.app.get('io').to(`project:${projectIdStr}`).emit('task_updated', serialized);
            }
        }

        res.status(200).json(serialized);
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

        const projectIdStr = removed.projectId.toString();

        await Activity.create({
            user: req.user.id,
            action: 'deleted task',
            target: removed.title
        });

        if (req.app.get('io')) {
            req.app.get('io').to(`project:${projectIdStr}`).emit('task_deleted', { id: req.params.id, projectId: projectIdStr });
        }

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