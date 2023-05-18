require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const spotifyRoutes = require('./routes/spotify');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8000;
const mongoURI = process.env.MONGODB_URI;

mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connection established successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.use('/spotify', spotifyRoutes);
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
