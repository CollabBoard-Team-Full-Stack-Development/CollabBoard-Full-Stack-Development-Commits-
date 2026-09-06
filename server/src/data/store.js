let users = [
    {
        id: 'u1',
        name: 'Hello User',
        email: 'manager@collabboard.com',

        // bcrypt hash for password123
        passwordHash: '$2a$10$Fo48FVi6tBSciT.naxsodeeK6QbGrpUZbA19.VA9sZDS6C6zk0Iau',

        role: 'admin',
        jobTitle: 'Project Manager',
        department: 'Management',
        status: 'Active',
        avatar: '',
        bio: 'Overseeing enterprise agile workflows and product delivery.',
        tasksCompleted: 24,
        activeTasks: 3,
        isActive: true
    },
    {
        id: 'u2',
        name: 'Hello Neighbor',
        email: 'employee@collabboard.com',

        // bcrypt hash for password123
        passwordHash: '$2a$10$Fo48FVi6tBSciT.naxsodeeK6QbGrpUZbA19.VA9sZDS6C6zk0Iau',

        role: 'employee',
        jobTitle: 'Frontend Developer',
        department: 'Engineering',
        status: 'Active',
        avatar: '',
        bio: 'Specializing in React, Tailwind CSS, and modern web architectures.',
        tasksCompleted: 18,
        activeTasks: 5,
        isActive: true
    }
];

let projects = [
    {
        id: 'p1',
        name: 'Smart Mop Enterprise Rollout',
        description:
            'University entrepreneurship project commercializing automated cleaning solutions.',
        color: 'bg-indigo-500',
        category: 'Product Launch',
        status: 'In Progress',
        dueDate: '2026-10-15',
        progress: 65,
        teamMembers: ['u1', 'u2']
    },
    {
        id: 'p2',
        name: 'CollabBoard v2.0 REST Migration',
        description:
            'Transitioning the mock-driven platform to a fully integrated Express & JWT API architecture.',
        color: 'bg-emerald-500',
        category: 'Engineering',
        status: 'Active',
        dueDate: '2026-09-30',
        progress: 80,
        teamMembers: ['u1', 'u2']
    },
    {
        id: 'p3',
        name: 'Campus Innovation Hub',
        description:
            'Building a centralized digital platform for students to discover, manage, and collaborate on university innovation projects.',
        color: 'bg-purple-500',
        category: 'Digital Platform',
        status: 'In Progress',
        dueDate: '2026-11-20',
        progress: 35,
        teamMembers: ['u1', 'u2']
    }
];

let tasks = [
    // =========================================================
    // PROJECT 1 - SMART MOP ENTERPRISE ROLLOUT
    // =========================================================

    {
        id: 't1',
        projectId: 'p1',
        title: 'Finalize Lean Business Canvas',
        description:
            'Complete value proposition and customer segment matrices for the Smart Mop presentation.',
        status: 'Done',
        priority: 'High',
        dueDate: '2026-09-05',
        assignees: ['u1']
    },
    {
        id: 't4',
        projectId: 'p1',
        title: 'Finalize Smart Mop Product Specifications',
        description:
            'Document the final hardware, cleaning modes, battery capacity, sensors, and safety specifications.',
        status: 'Doing',
        priority: 'Urgent',
        dueDate: '2026-09-08',
        assignees: ['u2']
    },
    {
        id: 't5',
        projectId: 'p1',
        title: 'Conduct Customer Market Research',
        description:
            'Interview potential customers and identify the most important automated cleaning requirements.',
        status: 'Doing',
        priority: 'High',
        dueDate: '2026-09-12',
        assignees: ['u1', 'u2']
    },
    {
        id: 't6',
        projectId: 'p1',
        title: 'Prepare Product Cost Analysis',
        description:
            'Calculate manufacturing, component, packaging, logistics, and estimated retail costs.',
        status: 'To Do',
        priority: 'Medium',
        dueDate: '2026-09-18',
        assignees: ['u1']
    },
    {
        id: 't7',
        projectId: 'p1',
        title: 'Design Smart Mop Marketing Campaign',
        description:
            'Create the initial marketing strategy covering social media, university demonstrations, and launch promotions.',
        status: 'To Do',
        priority: 'Medium',
        dueDate: '2026-09-25',
        assignees: ['u2']
    },
    {
        id: 't8',
        projectId: 'p1',
        title: 'Build Product Demonstration Prototype',
        description:
            'Prepare a functional prototype suitable for customer demonstrations and the final university presentation.',
        status: 'To Do',
        priority: 'High',
        dueDate: '2026-10-02',
        assignees: ['u2']
    },

    // =========================================================
    // PROJECT 2 - COLLABBOARD v2.0 REST MIGRATION
    // =========================================================

    {
        id: 't2',
        projectId: 'p2',
        title: 'Implement Express JWT Middleware',
        description:
            'Secure all protected routes and enforce role checks on backend endpoints.',
        status: 'Done',
        priority: 'Urgent',
        dueDate: '2026-09-02',
        assignees: ['u2']
    },
    {
        id: 't3',
        projectId: 'p2',
        title: 'Wire Frontend Axios Interceptors',
        description:
            'Ensure automatic bearer token attachment and centralized error handling.',
        status: 'Done',
        priority: 'Medium',
        dueDate: '2026-09-10',
        assignees: ['u2']
    },
    {
        id: 't9',
        projectId: 'p2',
        title: 'Implement Project CRUD API',
        description:
            'Create complete REST endpoints for creating, reading, updating, and deleting projects.',
        status: 'Done',
        priority: 'High',
        dueDate: '2026-09-04',
        assignees: ['u2']
    },
    {
        id: 't10',
        projectId: 'p2',
        title: 'Implement Task CRUD API',
        description:
            'Complete task creation, editing, deletion, assignment, and status update endpoints.',
        status: 'Doing',
        priority: 'High',
        dueDate: '2026-09-06',
        assignees: ['u2']
    },
    {
        id: 't11',
        projectId: 'p2',
        title: 'Connect Dashboard to REST API',
        description:
            'Replace remaining mock dashboard data with live API responses.',
        status: 'Doing',
        priority: 'Urgent',
        dueDate: '2026-09-08',
        assignees: ['u1', 'u2']
    },
    {
        id: 't12',
        projectId: 'p2',
        title: 'Implement Calendar and Reminder API',
        description:
            'Connect personal reminders and calendar events to authenticated backend endpoints.',
        status: 'To Do',
        priority: 'Medium',
        dueDate: '2026-09-12',
        assignees: ['u2']
    },
    {
        id: 't13',
        projectId: 'p2',
        title: 'Add API Error Handling',
        description:
            'Standardize validation errors, authentication errors, and server error responses.',
        status: 'To Do',
        priority: 'High',
        dueDate: '2026-09-15',
        assignees: ['u1']
    },
    {
        id: 't14',
        projectId: 'p2',
        title: 'Perform Full API Integration Testing',
        description:
            'Test authentication, projects, tasks, users, activities, and calendar endpoints.',
        status: 'To Do',
        priority: 'Urgent',
        dueDate: '2026-09-22',
        assignees: ['u1', 'u2']
    },

    // =========================================================
    // PROJECT 3 - CAMPUS INNOVATION HUB
    // =========================================================

    {
        id: 't15',
        projectId: 'p3',
        title: 'Define Innovation Hub Requirements',
        description:
            'Document the core functional and technical requirements for the university innovation platform.',
        status: 'Done',
        priority: 'High',
        dueDate: '2026-09-15',
        assignees: ['u1']
    },
    {
        id: 't16',
        projectId: 'p3',
        title: 'Design Platform User Experience',
        description:
            'Create wireframes and user flows for students, project leaders, mentors, and administrators.',
        status: 'Doing',
        priority: 'High',
        dueDate: '2026-09-22',
        assignees: ['u2']
    },
    {
        id: 't17',
        projectId: 'p3',
        title: 'Create Innovation Project Database',
        description:
            'Design the data structure for innovation projects, teams, categories, milestones, and applications.',
        status: 'Doing',
        priority: 'Urgent',
        dueDate: '2026-09-28',
        assignees: ['u2']
    },
    {
        id: 't18',
        projectId: 'p3',
        title: 'Build Project Discovery Interface',
        description:
            'Develop searchable project cards with categories, project status, team information, and descriptions.',
        status: 'To Do',
        priority: 'Medium',
        dueDate: '2026-10-05',
        assignees: ['u2']
    },
    {
        id: 't19',
        projectId: 'p3',
        title: 'Implement Student Team Registration',
        description:
            'Allow students to create teams, invite members, and register for innovation projects.',
        status: 'To Do',
        priority: 'High',
        dueDate: '2026-10-12',
        assignees: ['u1', 'u2']
    },
    {
        id: 't20',
        projectId: 'p3',
        title: 'Create Mentor Management Module',
        description:
            'Build functionality for mentors to review projects, provide feedback, and track team progress.',
        status: 'To Do',
        priority: 'Medium',
        dueDate: '2026-10-20',
        assignees: ['u1']
    },
    {
        id: 't21',
        projectId: 'p3',
        title: 'Add Project Milestone Tracking',
        description:
            'Implement milestones and progress tracking so teams can monitor their innovation projects.',
        status: 'To Do',
        priority: 'High',
        dueDate: '2026-10-28',
        assignees: ['u2']
    },
    {
        id: 't22',
        projectId: 'p3',
        title: 'Prepare Innovation Hub Launch',
        description:
            'Complete final testing, documentation, demonstration content, and launch preparation.',
        status: 'To Do',
        priority: 'Urgent',
        dueDate: '2026-11-15',
        assignees: ['u1', 'u2']
    }
];



let activities = [
    {
        id: 'a1',
        user: {
            name: 'Hello User',
            avatar:
                ''
        },
        action: 'created project',
        target: 'Smart Mop Enterprise Rollout',
        timestamp: new Date(
            Date.now() - 86400000
        ).toISOString()
    },
    {
        id: 'a2',
        user: {
            name: 'Hello Neighbor',
            avatar:
                ''
        },
        action: 'moved task',
        target: 'Implement Express JWT Middleware to Doing',
        timestamp: new Date(
            Date.now() - 43200000
        ).toISOString()
    }
];

let calendarEvents = [];

const addCalendarEvent = (event) => {
    const newEvent = {
        id: 'cal_' + Date.now(),
        ...event
    };

    calendarEvents.push(newEvent);

    return newEvent;
};

const deleteCalendarEvent = (id) => {
    const index = calendarEvents.findIndex(
        (event) => event.id === id
    );

    if (index === -1) {
        return false;
    }

    calendarEvents.splice(index, 1);

    return true;
};

const addActivity = (user, action, target) => {
    const newActivity = {
        id: 'a_' + Date.now(),

        user: {
            name: user || 'System',
            avatar: ''
        },

        action,
        target,

        timestamp: new Date().toISOString()
    };

    activities.unshift(newActivity);

    return newActivity;
};

module.exports = {
    users,
    projects,
    tasks,
    activities,
    addActivity,
    calendarEvents,
    addCalendarEvent,
    deleteCalendarEvent
};