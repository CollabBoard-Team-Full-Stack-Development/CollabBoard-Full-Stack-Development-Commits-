const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        date: {
            type: Date,
            required: true
        },

        type: {
            type: String,
            default: 'reminder'
        },

        color: {
            type: String,
            default: '#8B5CF6'
        }
    },
    {
        timestamps: true
    }
);

calendarEventSchema.index({
    userId: 1,
    date: 1
});

const CalendarEvent = mongoose.model(
    'CalendarEvent',
    calendarEventSchema
);

module.exports = CalendarEvent;