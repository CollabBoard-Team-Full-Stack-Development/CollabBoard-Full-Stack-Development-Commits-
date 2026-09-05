const express = require('express');

const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
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

router.delete(
    '/:id',
    adminMiddleware,
    deleteProject
);

module.exports = router;