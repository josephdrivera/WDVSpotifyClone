const express = require('express');
const jwt = require('jsonwebtoken');
const Playlist = require('../models/Playlist');

// Middleware for user authentication
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // If there isn't any token

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Middleware for input validation
const validatePlaylist = (req, res, next) => {
    const { name, description, tracks } = req.body;

    if (!name || !description || !tracks) {
        return res.status(400).json({ error: 'Missing required fields: name, description, or tracks.' });
    }

    next();
};

// Middleware for verifying ownership
async function verifyOwnership(req, res, next) {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (playlist.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: you do not have permission to modify this playlist.' });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
}

const router = express.Router();

router.post('/', authenticateToken, validatePlaylist, async (req, res) => {
    const { name, description, tracks } = req.body;

    const playlist = new Playlist({
        name,
        description,
        tracks,
        owner: req.user.id,  // Set the owner of the playlist
    });

    try {
        await playlist.save();
        res.status(201).json(playlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create a new playlist due to server error.' });
    }
});

router.get('/:id', authenticateToken, verifyOwnership, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
});

router.put('/:id', authenticateToken, verifyOwnership, async (req, res) => {
    const { name, description, tracks } = req.body;

    // Validate input
    if (!name && !description && !tracks) {
        return res.status(400).json({ message: 'Missing fields: name, description, or tracks.' });
    }

    try {
        const updatedPlaylist = await Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json(updatedPlaylist);
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
});

// Delete a playlist

router.delete('/:id', authenticateToken, verifyOwnership, async (req, res) => {
    try {
        await Playlist.findByIdAndRemove(req.params.id);
        res.json({ message: 'Playlist deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
