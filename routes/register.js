const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

// POST /register
router.post('/', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if a user with the given username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this username or email already exists.' });
        }

        // Create a new user
        const newUser = new User({
            username,
            email,
            password,  // this will be hashed by the pre-save hook
        });

        // Save the new user to the database
        await newUser.save();
        res.json({ message: 'User registered successfully.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
