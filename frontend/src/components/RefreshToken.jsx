import React from 'react'
import { useAuth } from "../context/authContext.jsx";
import { refreshAccessToken } from "../services/authService.js";

function RefreshToken() {
    const { setUser, setAccessToken } = useAuth();

    const handleRefresh = async () => {
        try {
            const data = await refreshAccessToken();
            console.log(data);
            setAccessToken(data.accessToken);
        } catch (err) {
            console.error(err);
        }
    }

    return (
    <button onClick={() => handleRefresh()}>refreshAccessToken</button>
  );
}

export default RefreshToken;