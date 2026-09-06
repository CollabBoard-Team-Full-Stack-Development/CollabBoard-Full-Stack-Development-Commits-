const {
calendarEvents,
addCalendarEvent,
deleteCalendarEvent
} = require('../data/store');

const getCalendarEvents = (req, res) => {
const userId = req.user.id;


const events = calendarEvents.filter(
    (event) => event.userId === userId
);

res.json(events);


};

const createCalendarEvent = (req, res) => {
const { title, date, type, color } = req.body;

if (!title || !date) {
    return res.status(400).json({
        error: 'Title and date are required'
    });
}

const newEvent = addCalendarEvent({
    userId: req.user.id,
    title,
    date,
    type: type || 'reminder',
    color: color || '#8B5CF6'
});

res.status(201).json(newEvent);


};

const deleteCalendarEventById = (req, res) => {
const { id } = req.params;
const userId = req.user.id;


const event = calendarEvents.find(
    (item) => item.id === id && item.userId === userId
);

if (!event) {
    return res.status(404).json({
        error: 'Calendar event not found'
    });
}

deleteCalendarEvent(id);

res.json({
    message: 'Calendar event deleted successfully'
});


};

module.exports = {
getCalendarEvents,
createCalendarEvent,
deleteCalendarEventById
};
