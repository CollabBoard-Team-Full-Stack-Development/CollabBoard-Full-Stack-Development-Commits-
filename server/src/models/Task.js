const { tasks } = require('../data/store');

const Task = {
    findAll: (projectId = null) => {
        if (projectId) {
            return tasks.filter(
                task =>
                    task.projectId === projectId
            );
        }

        return tasks;
    },

    findById: (id) => {
        return tasks.find(
            task => task.id === id
        );
    },

    create: (taskData) => {
        const newTask = {
            id: 't_' + Date.now(),
            projectId: taskData.projectId,
            title: taskData.title,
            description:
                taskData.description || '',
            status:
                taskData.status || 'To Do',
            priority:
                taskData.priority || 'Medium',
            dueDate:
                taskData.dueDate ||
                new Date()
                    .toISOString()
                    .split('T')[0],
            assignees:
                taskData.assignees || []
        };

        tasks.push(newTask);

        return newTask;
    },

    update: (id, updates) => {
        const task = tasks.find(
            task => task.id === id
        );

        if (!task) {
            return null;
        }

        Object.assign(task, updates);

        return task;
    },

    delete: (id) => {
        const index = tasks.findIndex(
            task => task.id === id
        );

        if (index === -1) {
            return null;
        }

        return tasks.splice(index, 1)[0];
    }
};

module.exports = Task;