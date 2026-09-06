const Project = require('../models/Project');
const Activity = require('../models/Activity');

const getProjects = (req, res, next) => {
    try {
        res.json(Project.findAll());
    } catch (error) {
        next(error);
    }
};

const getProjectById = (req, res, next) => {
    try {
        const project = Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        res.json(project);
    } catch (error) {
        next(error);
    }
};

const createProject = (req, res, next) => {
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

        const newProject = Project.create({
            name,
            description,
            color,
            category,
            dueDate,
            teamMembers
        });

        Activity.create(
            req.user?.name,
            'created project',
            name
        );

        res.status(201).json(newProject);
    } catch (error) {
        next(error);
    }
};

const updateProject = (req, res, next) => {
    try {
        const project = Project.update(
            req.params.id,
            req.body
        );

        if (!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        Activity.create(
            req.user?.name,
            'updated project',
            project.name
        );

        res.json(project);
    } catch (error) {
        next(error);
    }
};

const deleteProject = (req, res, next) => {
    try {
        const removed = Project.delete(req.params.id);

        if (!removed) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        Activity.create(
            req.user?.name,
            'deleted project',
            removed.name
        );

        res.json({
            message: 'Project deleted successfully',
            id: req.params.id
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };