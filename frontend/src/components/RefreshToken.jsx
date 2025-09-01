import React from 'react'
import { useAuth } from "../context/authContext.jsx";
import { refreshAccessToken } from "../services/authService.js";

function RefreshToken() {
    const { user, setUser, setAccessToken, accessToken } = useAuth();

    const handleRefresh = async () => {
        try {
            const data = await refreshAccessToken();
            setAccessToken(data.accessToken);
            setUser(data.user);
        } catch (err) {
            console.error(err);
        }
    }

    return (
    <button onClick={() => handleRefresh()}>refreshAccessToken</button>
  );
}

export default RefreshToken;