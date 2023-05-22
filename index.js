// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const spotifyRoutes = require('./routes/spotify');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const refreshRoutes = require('./routes/refresh');
const profileRoutes = require('./routes/profile');
const playlistsRouter = require('./routes/playlists');

// Initialize Express application
const app = express();

// Configure middleware
app.use(cors());
app.use(express.json());

// Define environment variables
const port = process.env.PORT || 8000;
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connection established successfully!'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define base route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Configure routes
app.use('/spotify', spotifyRoutes);
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/refresh', refreshRoutes);
app.use('/profile', profileRoutes);
app.use('/playlists', playlistsRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
