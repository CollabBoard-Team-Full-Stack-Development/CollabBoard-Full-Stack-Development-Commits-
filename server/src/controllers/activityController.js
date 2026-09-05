const Activity = require('../models/Activity');

const serializeActivity = (activity) => {
    const obj = activity.toObject();

    const {
        _id,
        user,
        createdAt,
        updatedAt,
        ...rest
    } = obj;

    return {
        ...rest,
        id: _id.toString(),
        user: user
            ? {
                  id: user._id
                      ? user._id.toString()
                      : undefined,
                  name: user.name,
                  avatar: user.avatar || ''
              }
            : {
                  name: 'System',
                  avatar: ''
              },
        timestamp: createdAt
            ? createdAt.toISOString()
            : new Date().toISOString()
    };
};

const getActivities = async (req, res, next) => {
    try {
        const activities = await Activity.find()
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 });

        res.json(activities.map(serializeActivity));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getActivities
};