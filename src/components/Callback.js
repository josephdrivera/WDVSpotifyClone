import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleRedirect } from '../services/SpotifyAuthService';

const Callback = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const getAccessToken = async () => {
            const searchParams = new URLSearchParams(location.search);
            const code = searchParams.get('code');
            const token = await handleRedirect(code);

            // Save the access token to local storage
            localStorage.setItem('accessToken', token.access_token);

            // Redirect user to the home page
            navigate('/'); // or wherever you want to redirect the user
        };

        getAccessToken();
    }, [location, navigate]);

    return (
        <div>
            Loading...
        </div>
    );
};

export default Callback;
