const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: ''
        },
        status: {
            type: String,
            enum: ['To Do', 'Doing', 'Done'],
            default: 'To Do'
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Urgent'],
            default: 'Medium'
        },
        dueDate: {
            type: Date
        },
        assignees: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: true
    }
);

taskSchema.index({ projectId: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;