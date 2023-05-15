import React from "react";
import { login } from "../services/SpotifyAuthService";

const Login = () => {
    return (
        <div className="login">
            <button onClick={login}>Login with Spotify</button>
        </div>
    );
}

// Export Login component
export default Login;