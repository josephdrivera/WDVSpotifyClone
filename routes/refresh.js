const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid refresh token.' });
            }

            // Generate a new access token
            const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
            });

            res.json({ accessToken: newAccessToken });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
