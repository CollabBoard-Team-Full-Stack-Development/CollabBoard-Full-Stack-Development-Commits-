const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const calendarRoutes = require('./routes/calendarRoutes');

const app = express();

app.use(cors());
app.use(express.json());

/*
 * API health check
 */
app.get('/api', (req, res) => {
    res.json({
        message: 'CollabBoard API is running successfully'
    });
});

/*
 * API routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/calendar', calendarRoutes);

/*
 * Error handling
 */
app.use(errorMiddleware);

module.exports = app;