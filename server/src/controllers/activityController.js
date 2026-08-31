const Activity = require('../models/Activity');

const getActivities = (
    req,
    res,
    next
) => {
    try {
        res.json(
            Activity.findAll()
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getActivities
};