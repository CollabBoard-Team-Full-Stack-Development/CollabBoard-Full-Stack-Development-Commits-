require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = require('./config/db');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Activity = require('./models/Activity');
const CalendarEvent = require('./models/CalendarEvent');

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log('Clearing existing CollabBoard data...');

        await Activity.deleteMany({});
        await Task.deleteMany({});
        await Project.deleteMany({});
        await CalendarEvent.deleteMany({});
        await User.deleteMany({});

        console.log('Creating demo users...');

        const passwordHash = await bcrypt.hash('password123', 10);

        const users = await User.insertMany([
            {
                name: 'Hello User',
                email: 'manager@collabboard.com',
                passwordHash,
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
                name: 'Hello Neighbor',
                email: 'employee@collabboard.com',
                passwordHash,
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
        ]);

        const manager = users[0];
        const employee = users[1];

        const projects = await Project.insertMany([
            {
                name: 'Smart Mop Enterprise Rollout',
                description: 'University entrepreneurship project commercializing automated cleaning solutions.',
                color: 'bg-indigo-500',
                category: 'Product Launch',
                status: 'In Progress',
                dueDate: new Date('2026-10-15'),
                progress: 65,
                teamMembers: [manager._id, employee._id]
            },
            {
                name: 'CollabBoard v2.0 REST Migration',
                description: 'Transitioning the mock-driven platform to a fully integrated Express & JWT API architecture.',
                color: 'bg-emerald-500',
                category: 'Engineering',
                status: 'Active',
                dueDate: new Date('2026-09-30'),
                progress: 80,
                teamMembers: [manager._id, employee._id]
            },
            {
                name: 'Campus Innovation Hub',
                description: 'Building a centralized digital platform for students to discover, manage, and collaborate on university innovation projects.',
                color: 'bg-purple-500',
                category: 'Digital Platform',
                status: 'In Progress',
                dueDate: new Date('2026-11-20'),
                progress: 35,
                teamMembers: [manager._id, employee._id]
            }
        ]);

        const [project1, project2, project3] = projects;

        const tasks = [
            {
                projectId: project1._id,
                title: 'Finalize Lean Business Canvas',
                description: 'Complete value proposition and customer segment matrices for the Smart Mop presentation.',
                status: 'Done',
                priority: 'High',
                dueDate: new Date('2026-09-05'),
                assignees: [manager._id]
            },
            {
                projectId: project1._id,
                title: 'Finalize Smart Mop Product Specifications',
                description: 'Document the final hardware, cleaning modes, battery capacity, sensors, and safety specifications.',
                status: 'Doing',
                priority: 'Urgent',
                dueDate: new Date('2026-09-08'),
                assignees: [employee._id]
            },
            {
                projectId: project1._id,
                title: 'Conduct Customer Market Research',
                description: 'Interview potential customers and identify the most important automated cleaning requirements.',
                status: 'Doing',
                priority: 'High',
                dueDate: new Date('2026-09-12'),
                assignees: [manager._id, employee._id]
            },
            {
                projectId: project1._id,
                title: 'Prepare Product Cost Analysis',
                description: 'Calculate manufacturing, component, packaging, logistics, and estimated retail costs.',
                status: 'To Do',
                priority: 'Medium',
                dueDate: new Date('2026-09-18'),
                assignees: [manager._id]
            },
            {
                projectId: project1._id,
                title: 'Design Smart Mop Marketing Campaign',
                description: 'Create the initial marketing strategy covering social media, university demonstrations, and launch promotions.',
                status: 'To Do',
                priority: 'Medium',
                dueDate: new Date('2026-09-25'),
                assignees: [employee._id]
            },
            {
                projectId: project1._id,
                title: 'Build Product Demonstration Prototype',
                description: 'Prepare a functional prototype suitable for customer demonstrations and the final university presentation.',
                status: 'To Do',
                priority: 'High',
                dueDate: new Date('2026-10-02'),
                assignees: [employee._id]
            },
            {
                projectId: project2._id,
                title: 'Implement Express JWT Middleware',
                description: 'Secure all protected routes and enforce role checks on backend endpoints.',
                status: 'Done',
                priority: 'Urgent',
                dueDate: new Date('2026-09-02'),
                assignees: [employee._id]
            },
            {
                projectId: project2._id,
                title: 'Wire Frontend Axios Interceptors',
                description: 'Ensure automatic bearer token attachment and centralized error handling.',
                status: 'Done',
                priority: 'Medium',
                dueDate: new Date('2026-09-10'),
                assignees: [employee._id]
            },
            {
                projectId: project2._id,
                title: 'Implement Project CRUD API',
                description: 'Create complete REST endpoints for creating, reading, updating, and deleting projects.',
                status: 'Done',
                priority: 'High',
                dueDate: new Date('2026-09-04'),
                assignees: [employee._id]
            },
            {
                projectId: project2._id,
                title: 'Implement Task CRUD API',
                description: 'Complete task creation, editing, deletion, assignment, and status update endpoints.',
                status: 'Doing',
                priority: 'High',
                dueDate: new Date('2026-09-06'),
                assignees: [employee._id]
            },
            {
                projectId: project2._id,
                title: 'Connect Dashboard to REST API',
                description: 'Replace remaining mock dashboard data with live API responses.',
                status: 'Doing',
                priority: 'Urgent',
                dueDate: new Date('2026-09-08'),
                assignees: [manager._id, employee._id]
            },
            {
                projectId: project2._id,
                title: 'Implement Calendar and Reminder API',
                description: 'Connect personal reminders and calendar events to authenticated backend endpoints.',
                status: 'To Do',
                priority: 'Medium',
                dueDate: new Date('2026-09-12'),
                assignees: [employee._id]
            },
            {
                projectId: project2._id,
                title: 'Add API Error Handling',
                description: 'Standardize validation errors, authentication errors, and server error responses.',
                status: 'To Do',
                priority: 'High',
                dueDate: new Date('2026-09-15'),
                assignees: [manager._id]
            },
            {
                projectId: project2._id,
                title: 'Perform Full API Integration Testing',
                description: 'Test authentication, projects, tasks, users, activities, and calendar endpoints.',
                status: 'To Do',
                priority: 'Urgent',
                dueDate: new Date('2026-09-22'),
                assignees: [manager._id, employee._id]
            },
            {
                projectId: project3._id,
                title: 'Define Innovation Hub Requirements',
                description: 'Document the core functional and technical requirements for the university innovation platform.',
                status: 'Done',
                priority: 'High',
                dueDate: new Date('2026-09-15'),
                assignees: [manager._id]
            },
            {
                projectId: project3._id,
                title: 'Design Platform User Experience',
                description: 'Create wireframes and user flows for students, project leaders, mentors, and administrators.',
                status: 'Doing',
                priority: 'High',
                dueDate: new Date('2026-09-22'),
                assignees: [employee._id]
            },
            {
                projectId: project3._id,
                title: 'Create Innovation Project Database',
                description: 'Design the data structure for innovation projects, teams, categories, milestones, and applications.',
                status: 'Doing',
                priority: 'Urgent',
                dueDate: new Date('2026-09-28'),
                assignees: [employee._id]
            },
            {
                projectId: project3._id,
                title: 'Build Project Discovery Interface',
                description: 'Develop searchable project cards with categories, project status, team information, and descriptions.',
                status: 'To Do',
                priority: 'Medium',
                dueDate: new Date('2026-10-05'),
                assignees: [employee._id]
            },
            {
                projectId: project3._id,
                title: 'Implement Student Team Registration',
                description: 'Allow students to create teams, invite members, and register for innovation projects.',
                status: 'To Do',
                priority: 'High',
                dueDate: new Date('2026-10-12'),
                assignees: [manager._id, employee._id]
            },
            {
                projectId: project3._id,
                title: 'Create Mentor Management Module',
                description: 'Build functionality for mentors to review projects, provide feedback, and track team progress.',
                status: 'To Do',
                priority: 'Medium',
                dueDate: new Date('2026-10-20'),
                assignees: [manager._id]
            },
            {
                projectId: project3._id,
                title: 'Add Project Milestone Tracking',
                description: 'Implement milestones and progress tracking so teams can monitor their innovation projects.',
                status: 'To Do',
                priority: 'High',
                dueDate: new Date('2026-10-28'),
                assignees: [employee._id]
            },
            {
                projectId: project3._id,
                title: 'Prepare Innovation Hub Launch',
                description: 'Complete final testing, documentation, demonstration content, and launch preparation.',
                status: 'To Do',
                priority: 'Urgent',
                dueDate: new Date('2026-11-15'),
                assignees: [manager._id, employee._id]
            }
        ];

        await Task.insertMany(tasks);

        await Activity.insertMany([
            {
                user: manager._id,
                action: 'created project',
                target: 'Smart Mop Enterprise Rollout',
                createdAt: new Date(Date.now() - 86400000)
            },
            {
                user: employee._id,
                action: 'moved task',
                target: 'Implement Express JWT Middleware to Doing',
                createdAt: new Date(Date.now() - 43200000)
            }
        ]);

        console.log('CollabBoard database seeded successfully.');
        console.log('Manager:', 'manager@collabboard.com / password123');
        console.log('Employee:', 'employee@collabboard.com / password123');
    } catch (error) {
        console.error('Database seeding failed:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

seedDatabase();