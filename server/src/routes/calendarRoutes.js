const express = require('express');

const {
getCalendarEvents,
createCalendarEvent,
deleteCalendarEventById
} = require('../controllers/calendarController');

const {
authMiddleware
} = require('../middleware/authMiddleware');

const router = express.Router();

// All calendar endpoints require authentication
router.use(authMiddleware);

router.get('/', getCalendarEvents);

router.post('/', createCalendarEvent);

router.delete('/:id', deleteCalendarEventById);

module.exports = router;
