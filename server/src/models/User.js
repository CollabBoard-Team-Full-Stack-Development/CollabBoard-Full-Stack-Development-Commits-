const { users } = require('../data/store');

const User = {
    findAll: () => {
        return users;
    },

    findById: (id) => {
        return users.find(user => user.id === id);
    },

    findByEmail: (email) => {
        return users.find(
            user =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        );
    },

    create: (userData) => {
        const newUser = {
            id: 'u_' + Date.now(),
            name: userData.name,
            email: userData.email,
            passwordHash: userData.passwordHash,
            role: userData.role || 'employee',
            jobTitle: userData.jobTitle || 'Team Member',
            department: userData.department || 'General',
            status: 'Active',
            avatar: userData.avatar || '',
            bio:
                userData.bio ||
                'New CollabBoard team participant.',
            tasksCompleted:
                userData.tasksCompleted || 0,
            activeTasks:
                userData.activeTasks || 0,
            isActive:
                userData.isActive !== undefined
                    ? userData.isActive
                    : true
        };

        users.push(newUser);

        return newUser;
    },

    update: (id, updates) => {
        const user = users.find(user => user.id === id);

        if (!user) {
            return null;
        }

        Object.assign(user, updates);

        return user;
    },

    delete: (id) => {
        const index = users.findIndex(
            user => user.id === id
        );

        if (index === -1) {
            return null;
        }

        return users.splice(index, 1)[0];
    }
};

module.exports = User;