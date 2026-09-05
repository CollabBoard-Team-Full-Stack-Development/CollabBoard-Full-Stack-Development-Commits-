const express = require('express');

const {
    getActivities
} = require('../controllers/activityController');

const {
    authMiddleware
} = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get(
    '/',
    getActivities
);

module.exports = router;