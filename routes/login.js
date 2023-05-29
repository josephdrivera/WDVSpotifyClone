const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const { searchSpotify } = require('./spotify'); // import the searchSpotify function

const router = express.Router();

// POST /login
router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h', // token will expire in 1 hour
        });

        // Search Spotify
        const spotifyData = await searchSpotify(user.spotifySearchTerm);

        res.json({
            message: 'Logged in successfully.',
            token,
            spotifyData,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// POST /logout
router.post('/logout', authMiddleware, (req, res) => {
    try {
        // Get the user ID from the authenticated user's data in req.user
        const userId = req.user.id;

        res.json({ message: 'Logout successful.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Protected route in login.js
router.get('/protected', authMiddleware, (req, res) => {
    // Access the authenticated user's data from req.user
    const userId = req.user.id;
    // Handle the protected route logic here
    res.json({ message: 'Protected route accessed successfully.' });
});

module.exports = router;
