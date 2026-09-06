const CalendarEvent = require('../models/CalendarEvent');

const serializeEvent = (event) => {
    const obj = event.toObject();

    const {
        _id,
        ...rest
    } = obj;

    return {
        ...rest,
        id: _id.toString()
    };
};

const getCalendarEvents = async (req, res, next) => {
    try {
        const events = await CalendarEvent.find({
            userId: req.user.id
        }).sort({ date: 1 });

        res.json(events.map(serializeEvent));
    } catch (error) {
        next(error);
    }
};

const createCalendarEvent = async (req, res, next) => {
    try {
        const {
            title,
            date,
            type,
            color
        } = req.body;

        if (!title || !date) {
            return res.status(400).json({
                error: 'Title and date are required'
            });
        }

        const event = await CalendarEvent.create({
            userId: req.user.id,
            title,
            date,
            type: type || 'reminder',
            color: color || '#8B5CF6'
        });

        res.status(201).json(serializeEvent(event));
    } catch (error) {
        next(error);
    }
};

const deleteCalendarEventById = async (req, res, next) => {
    try {
        const event = await CalendarEvent.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!event) {
            return res.status(404).json({
                error: 'Calendar event not found'
            });
        }

        res.json({
            message: 'Calendar event deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCalendarEvents,
    createCalendarEvent,
    deleteCalendarEventById
};