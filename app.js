require('dotenv').config();
const express = require('express');
const request = require('request');

// Path: app.js
const app = express();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

app.get('/login', function (req, res) {
    var scopes = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize' + '?response_type=code' + '&client_id=' + client_id + (scopes ? '&scope=' + encodeURIComponent(scopes) : '') + '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

app.get('/callback', function (req, res) {
    var code = req.query.code || null;
    var authOptions = {
        URL: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))

        },
        json: true
    };
    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token,
                refresh_token = body.refresh_token;

            var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };
            request.get(options, function (error, response, body) {
                console.log(body);
            }
            );
            res.redirect('/#' + access_token + '/' + refresh_token);
        } else {
            res.redirect('/#' + access_token + '/' + refresh_token);
        }
    });
});


app.listen(8000, () => console.log('Server started on port 3000'));

module.exports = app;
