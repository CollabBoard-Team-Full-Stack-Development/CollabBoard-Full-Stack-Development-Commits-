const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        passwordHash: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: String,
            enum: ['admin', 'manager', 'employee'],
            default: 'employee'
        },
        jobTitle: {
            type: String,
            default: 'Team Member'
        },
        department: {
            type: String,
            default: 'General'
        },
        status: {
            type: String,
            default: 'Active'
        },
        avatar: {
            type: String,
            default: ''
        },
        bio: {
            type: String,
            default: 'New CollabBoard team participant.'
        },
        tasksCompleted: {
            type: Number,
            default: 0,
            min: 0
        },
        activeTasks: {
            type: Number,
            default: 0,
            min: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;