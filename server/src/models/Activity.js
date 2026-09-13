const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        action: {
            type: String,
            required: true
        },
        target: {
            type: String,
            required: true
        },
        from: {
            type: String,
            default: ''
        },
        to: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

activitySchema.index({ createdAt: -1 });

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;