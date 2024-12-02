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
                return res.status(400).json({ status: 400, message: 'User already exists' });
            }

            // Check if the requester is an admin to assign roles
            const requesterRole = req.user?.role; // Assuming `req.user` is populated by middleware
            if (role && requesterRole !== 'admin') {
                return res.status(403).json({ error: 'Only admins can assign roles' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const user = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: role || 'user', // Default role to 'user'
            });

            res.status(201).json({ message: 'User created successfully', user });
        } catch (error) {
            logger.error(`Error creating user: ${error.message}`);
            res.status(500).json({status: 400, message: 'Error creating user' });
        }
    },

    // Login User
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ where: { email } });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Generate Access Token
            const accessToken = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Generate Refresh Token
            const refreshToken = jwt.sign(
                { id: user.id },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: '7d' }
            );

            // Save Refresh Token to Database
            await RefreshToken.create({ token: refreshToken, user_id: user.id });

            // Set Refresh Token as HttpOnly Cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            // Return Access Token
            res.status(200).json({ accessToken });
        } catch (error) {
            logger.error(`Error logging in user: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Refresh Token
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token required' });
            }

            let decoded;
            try {
                decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Refresh token expired' });
                }
                throw error;
            }

            // Check if Refresh Token exists in the database
            const storedToken = await RefreshToken.findOne({ where: { token: refreshToken } });
            if (!storedToken) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            // Find user associated with the token
            const user = await User.findByPk(decoded.id);

            // Generate New Access Token
            const newAccessToken = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ accessToken: newAccessToken });
        } catch (error) {
            logger.error(`Error refreshing token: ${error.message}`);
            res.status(403).json({ message: 'Invalid or expired refresh token' });
        }
    },

    // Logout User
    async logout(req, res) {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                return res.status(400).json({ message: 'Refresh token missing' });
            }

            // Remove Refresh Token from the Database
            await RefreshToken.destroy({ where: { token: refreshToken } });

            // Clear Refresh Token Cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
            });

            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            logger.error(`Error logging out user: ${error.message}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

module.exports = userController;
