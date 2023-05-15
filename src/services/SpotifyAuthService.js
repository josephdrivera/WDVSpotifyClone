import axios from "axios";
import qs from 'qs';

// Spotify API endpoints
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;

// URL to get the access token
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=streaming%20user-read-email%20user-read-private`;

// Export login function
export const login = () => {
    window.location = AUTH_URL;
};

// Export handleRedirect function
export const handleRedirect = async (code) => {
    const authOptions = {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        data: qs.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret,
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };
    const response = await axios(authOptions);
    return response.data;
};
