const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: ''
        },
        color: {
            type: String,
            default: 'bg-blue-500'
        },
        category: {
            type: String,
            default: 'General'
        },
        status: {
            type: String,
            default: 'Active'
        },
        dueDate: {
            type: Date
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        teamMembers: [
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

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;