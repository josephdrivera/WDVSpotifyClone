const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const spotify = require('./spotify');

const router = express.Router();

// POST /refresh
router.post('/', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        // Check if the refresh token exists in the database
        const user = await User.findOne({ refreshToken });

        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token.' });
        }

        // Verify the refresh token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid refresh token.' });
            }

            // Use the Spotify module to refresh the access token
            try {
                const newAccessToken = await spotify.getAccessToken();

                res.json({ accessToken: newAccessToken });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Failed to refresh access token.' });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
