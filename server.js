require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const querystring = require('querystring')
const app = express()

app.use(cors())

const port = process.env.PORT || 8000;
const redirect_uri = process.env.REDIRECT_URI


app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/login', (req, res) => {
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: process.env.CLIENT_ID,
            scope: 'user-read-private user-read-email ',
            redirect_uri
        }))
})

app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    try {
        const response = await axios({
            url: 'https://accounts.spotify.com/api/token',
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

