const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const spotify = require('./spotify');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST /register
router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the username or email already exists
        const existingUser = await User.findOne({
            $or: [{ username: username }, { email: email }],
        });

        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Use the Spotify module to perform additional actions
        try {
            const accessToken = await spotify.getAccessToken();
            // Perform additional actions with the access token
            // For example, create a playlist for the user or perform other operations

            res.json({ message: 'User registered successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to perform additional actions with Spotify.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Protected route in register.js
router.get('/protected', authMiddleware, (req, res) => {
    // Access the authenticated user's data from req.user
    const userId = req.user.id;
    // Handle the protected route logic here
    res.json({ message: 'Protected route accessed successfully.' });
});

module.exports = router;
