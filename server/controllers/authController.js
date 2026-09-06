const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Activity = require('../models/Activity');

const JWT_SECRET =
    process.env.JWT_SECRET ||
    'collabboard_super_secret_key';

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            avatar: user.avatar || ''
        },
        JWT_SECRET,
        {
            expiresIn: '24h'
        }
    );
};

const register = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            role,
            jobTitle,
            department
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message:
                    'Please provide name, email, and password.'
            });
        }

        const existingUser = User.findByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                message:
                    'User with this email already exists.'
            });
        }

        const passwordHash = await bcrypt.hash(
            password,
            10
        );

        const newUser = User.create({
            name,
            email,
            passwordHash,
            role,
            jobTitle,
            department
        });

        Activity.create(
            newUser.name,
            'registered',
            'CollabBoard platform'
        );

        const token = generateToken(newUser);

        const {
            passwordHash: _,
            ...safeUser
        } = newUser;

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: safeUser
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message:
                    'Please provide email and password.'
            });
        }

        const user = User.findByEmail(email);

        if (!user) {
            return res.status(401).json({
                message:
                    'Invalid email or password.'
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isMatch) {
            return res.status(401).json({
                message:
                    'Invalid email or password.'
            });
        }

        const token = generateToken(user);

        Activity.create(
            user.name,
            'logged in',
            'CollabBoard'
        );

        const {
            passwordHash: _,
            ...safeUser
        } = user;

        res.json({
            message: 'Login successful',
            token,
            user: safeUser
        });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        const {
            passwordHash: _,
            ...safeUser
        } = user;

        res.json({
            user: safeUser
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe
};