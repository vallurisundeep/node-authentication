const User = require('../models/User');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

const userController = {
    // Create User
    async createUser(req, res) {
        try {
            const { firstName, lastName, email, password, role } = req.body;

            // Check if the user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Check if the requester is an admin to assign roles
            const requesterRole = req.user?.role; // Assuming `req.user` is populated by middleware
            if (role && requesterRole !== 'admin') {
                return res.status(403).json({ error: 'Only admins can assign roles' });
            }

            // Create a new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: role || 'user', // Assign role or default to 'user'
            });

            res.status(201).json(user);
        } catch (error) {
            logger.error(`Error creating user: ${error.message}`);
            res.status(500).json({ error: 'Error creating user' });
        }
    },

    // Login User
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Verify password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate Access Token
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role }, // Include role in payload
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            logger.info(`JWT generated for user: ${user.email}`);

            // Generate Refresh Token
            const refreshToken = jwt.sign(
                { id: user.id },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: '7d' } // Refresh token valid for 7 days
            );

            // Save Refresh Token to Database
            await RefreshToken.create({ token: refreshToken, user_id: user.id });
            logger.info(`Refresh token generated for user: ${user.email}`);

            res.status(200).json({ token, refreshToken });
        } catch (error) {
            logger.error(`Error logging in user: ${error.message}`);
            res.status(500).json({ error: 'Error logging in user' });
        }
    },

    // Refresh Token
    async refreshToken(req, res) {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(401).json({ message: 'Refresh token required' });
            }

            // Verify Refresh Token
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            console.log('Decoded:', decoded);
            // Check if Refresh Token exists in the database
            const storedToken = await RefreshToken.findOne({ where: { token } });
            if (!storedToken) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            // Generate New Access Token
            const newToken = jwt.sign(
                { id: decoded.id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ token: newToken });
        } catch (error) {
            logger.error(`Error refreshing token: ${error.message}`);
            res.status(403).json({ message: 'Invalid or expired refresh token' });
        }
    },
};

module.exports = userController;
