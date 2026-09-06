const express = require('express');

const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    addMemberToProject,
    removeMemberFromProject,
    deleteProject
} = require('../controllers/projectController');

const {
    authMiddleware,
    adminMiddleware
} = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getProjects);
router.get('/:id', getProjectById);

router.post(
    '/',
    adminMiddleware,
    createProject
);

router.patch(
    '/:id',
    adminMiddleware,
    updateProject
);

// Route to assign a team member to a project workspace
router.post(
    '/:id/members',
    adminMiddleware,
    addMemberToProject
);

router.delete(
    '/:id/members/:userId',
    adminMiddleware,
    removeMemberFromProject
);

router.delete(
    '/:id',
    adminMiddleware,
    deleteProject
);

module.exports = router;