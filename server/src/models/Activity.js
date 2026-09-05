const {
    activities,
    addActivity
} = require('../data/store');

const Activity = {
    findAll: () => {
        return activities;
    },

    create: (
        user,
        action,
        target
    ) => {
        return addActivity(
            user,
            action,
            target
        );
    }
};

module.exports = Activity;