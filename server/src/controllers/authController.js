const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Activity = require('../models/Activity');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined.');
}

const sanitizeUser = (user) => {
    const obj = user.toObject ? user.toObject() : user;
    const { passwordHash, ...safeUser } = obj;

    return {
        ...safeUser,
        id: safeUser._id ? safeUser._id.toString() : safeUser.id
    };
};

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id ? user._id.toString() : user.id,
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
        const { name, email, password, role, jobTitle, department } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Please provide name, email, and password.'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                message: 'User with this email already exists.'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
            role: role === 'admin' || role === 'manager' ? role : 'employee',
            jobTitle: jobTitle || '',
            department: department || ''
        });

        // Wrap activity logging safely so it never blocks registration
        try {
            await Activity.create({
                user: newUser._id,
                action: 'registered',
                target: 'CollabBoard platform'
            });
        } catch (actErr) {
            console.error('Failed to log registration activity:', actErr);
        }

        const token = generateToken(newUser);

        return res.status(201).json({
            message: 'Registration successful',
            token,
            user: sanitizeUser(newUser)
        });
    } catch (error) {
        console.error('Unhandled server exception during registration:', error);
        return next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('Login failed: Missing email or password in request body');
            return res.status(400).json({
                message: 'Please provide email and password.'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        console.log(`Attempting login for email: "${normalizedEmail}"`);

        const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

        if (!user) {
            console.log(`Login failed: User document not found in MongoDB for email: "${normalizedEmail}"`);
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        if (user.isActive === false) {
            console.log(`Login failed: Account is inactive for email: "${normalizedEmail}"`);
            return res.status(403).json({
                message: 'This account is inactive.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            console.log(`Login failed: Password hash comparison failed for email: "${normalizedEmail}"`);
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        const token = generateToken(user);

        try {
            await Activity.create({
                user: user._id,
                action: 'logged in',
                target: 'CollabBoard'
            });
        } catch (actErr) {
            console.error('Failed to log login activity:', actErr);
        }

        console.log(`Login successful for user: "${normalizedEmail}"`);

        return res.json({
            message: 'Login successful',
            token,
            user: sanitizeUser(user)
        });
    } catch (error) {
        console.error('Unhandled server exception during login:', error);
        return next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        return res.json({
            user: sanitizeUser(user)
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    register,
    login,
    getMe
};