const mongoose = require('mongoose');

const Project = require('../models/Project');
const Activity = require('../models/Activity');

const serializeProject = (project) => {
    const obj = project.toObject();
    const { _id, teamMembers, ...rest } = obj;

    return {
        ...rest,
        id: _id.toString(),
        teamMembers: Array.isArray(teamMembers)
            ? teamMembers.map((member) => {
                if (member && member._id) {
                    return {
                        id: member._id.toString(),
                        name: member.name,
                        email: member.email,
                        avatar: member.avatar || '',
                        role: member.role,
                        jobTitle: member.jobTitle
                    };
                }

                return member?.toString ? member.toString() : member;
            })
            : []
    };
};

const getProjects = async (req, res, next) => {
    try {
        let query = {};
        
        // If the logged-in user is an employee, only fetch projects they are explicitly a member of
        if (req.user.role !== 'admin' && req.user.role !== 'manager') {
            query = { teamMembers: req.user.id };
        }

        const projects = await Project.find(query)
            .populate('teamMembers', 'name email avatar role jobTitle')
            .sort({ createdAt: -1 });

        res.json(projects.map(serializeProject));
    } catch (error) {
        next(error);
    }
};

const getProjectById = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid project ID' });
        }

        const project = await Project.findById(req.params.id).populate(
            'teamMembers',
            'name email avatar role jobTitle'
        );

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(serializeProject(project));
    } catch (error) {
        next(error);
    }
};

const createProject = async (req, res, next) => {
    try {
        const {
            name,
            description,
            color,
            category,
            dueDate,
            teamMembers
        } = req.body;

        if (!name) {
            return res.status(400).json({
                message: 'Project name is required'
            });
        }

        // New projects start with an empty or explicitly given team array (no auto-assignment of all users)
        const project = await Project.create({
            name,
            description: description || '',
            color: color || 'bg-blue-500',
            category: category || 'General',
            status: 'Active',
            dueDate,
            progress: 0,
            teamMembers: Array.isArray(teamMembers) ? teamMembers : []
        });

        try {
            await Activity.create({
                user: req.user.id,
                action: 'created project',
                target: project.name
            });
        } catch (actErr) {
            console.error('Activity log error:', actErr);
        }

        const populated = await Project.findById(project._id).populate(
            'teamMembers',
            'name email avatar role jobTitle'
        );

        res.status(201).json(serializeProject(populated));
    } catch (error) {
        next(error);
    }
};

const updateProject = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid project ID'
            });
        }

        const { _id, id, ...updates } = req.body;

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        ).populate('teamMembers', 'name email avatar role jobTitle');

        if (!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        try {
            await Activity.create({
                user: req.user.id,
                action: 'updated project',
                target: project.name
            });
        } catch (actErr) {
            console.error('Activity log error:', actErr);
        }

        res.json(serializeProject(project));
    } catch (error) {
        next(error);
    }
};

// Endpoint to explicitly add a member to a specific project
const addMemberToProject = async (req, res, next) => {
    try {
        const { id } = req.params; // project id
        const { userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid project ID or user ID' });
        }

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (!project.teamMembers.includes(userId)) {
            project.teamMembers.push(userId);
            await project.save();
        }

        const populated = await Project.findById(id).populate(
            'teamMembers',
            'name email avatar role jobTitle'
        );

        res.json(serializeProject(populated));
    } catch (error) {
        next(error);
    }
};

const deleteProject = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid project ID'
            });
        }

        const removed = await Project.findByIdAndDelete(req.params.id);

        if (!removed) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        const Task = require('../models/Task');

        await Task.deleteMany({
            projectId: removed._id
        });

        try {
            await Activity.create({
                user: req.user.id,
                action: 'deleted project',
                target: removed.name
            });
        } catch (actErr) {
            console.error('Activity log error:', actErr);
        }

        res.json({
            message: 'Project deleted successfully',
            id: req.params.id
        });
    } catch (error) {
        next(error);
    }
};

const removeMemberFromProject = async (req, res, next) => {
    try {
        const { id, userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid project ID or user ID' });
        }

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.teamMembers = project.teamMembers.filter(
            (memberId) => memberId.toString() !== userId
        );
        await project.save();

        const populated = await Project.findById(id).populate(
            'teamMembers',
            'name email avatar role jobTitle'
        );

        res.json(serializeProject(populated));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    addMemberToProject,
    removeMemberFromProject,
    deleteProject
};