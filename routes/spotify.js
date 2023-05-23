const axios = require('axios');
const express = require('express');
const router = express.Router();

// Retrieve credentials from environment variables
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

const getAccessToken = async () => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      null,
      {
        params: {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        },
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${clientId}:${clientSecret}`
          ).toString('base64')}`,
        },
      }
    );

    return response.data.access_token;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to refresh access token.');
  }
};

router.get('/search/:term', async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(`https://api.spotify.com/v1/search?q=${req.params.term}&type=track`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch data from Spotify.');
  }
});

module.exports = router;
