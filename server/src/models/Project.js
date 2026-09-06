const { projects } = require('../data/store');

const Project = {
    findAll: () => {
        return projects;
    },

    findById: (id) => {
        return projects.find(
            project => project.id === id
        );
    },

    create: (projectData) => {
        const newProject = {
            id: 'p_' + Date.now(),
            name: projectData.name,
            description:
                projectData.description || '',
            color:
                projectData.color ||
                'bg-blue-500',
            category:
                projectData.category ||
                'General',
            status: 'Active',
            dueDate:
                projectData.dueDate ||
                new Date()
                    .toISOString()
                    .split('T')[0],
            progress: 0,
            teamMembers:
                projectData.teamMembers || []
        };

        projects.push(newProject);

        return newProject;
    },

    update: (id, updates) => {
        const project = projects.find(
            project => project.id === id
        );

        if (!project) {
            return null;
        }

        Object.assign(project, updates);

        return project;
    },

    delete: (id) => {
        const index = projects.findIndex(
            project => project.id === id
        );

        if (index === -1) {
            return null;
        }

        return projects.splice(index, 1)[0];
    }
};

module.exports = Project;