const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const router = express.Router();

const redirect_uri = process.env.REDIRECT_URI

router.get('/Login', (req, res) => {
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: process.env.CLIENT_ID,
            scope: 'user-read-private user-read-email ',
            redirect_uri
        }))
})

router.get('/Callback', async (req, res) => {
    const code = req.query.code || null;
    try {
        const response = await axios({
            urel: 'https://accounts.spotify.com/api/token',
            method: 'post',
            params: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code',
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
            },
        });
        res.redirect(`/#access_token=${response.data.access_token}&refresh_token=${response.data.refresh_token}`);
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
});

module.exports = router;