const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET /spotify/search
router.get('/search', authMiddleware, async (req, res) => {
    try {
        const { query } = req.query;
        const token = req.headers.authorization;

        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: {
                Authorization: token,
            },
            params: {
                q: query,
                type: 'track',
            },
        });

        const data = response.data;

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Protected route in spotify.js
router.get('/protected', authMiddleware, (req, res) => {
    // Handle the protected route logic here
    res.json({ message: 'Protected route accessed successfully.' });
});

module.exports = router;
