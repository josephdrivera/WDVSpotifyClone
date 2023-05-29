const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// Import Spotify module
const spotify = require('./spotify');

const router = express.Router();

// GET /profile
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const { _id, username, email } = user;

        res.json({ _id, username, email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// PUT /profile
router.put('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user._id.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to update this profile.' });
        }

        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        await user.save();

        const { _id, username, email } = user;

        res.json({ _id, username, email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// GET /profile/topTracks
router.get('/topTracks', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Use Spotify module to get user's top tracks
        const topTracks = await spotify.searchSpotify('Top Tracks'); // Replace 'Top Tracks' with user preference

        res.json({ topTracks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
