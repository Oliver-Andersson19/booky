// frontend/src/context/authContext.js
import { refreshAccessToken, fetchWithToken } from "../services/authService.js";
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);


  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await refreshAccessToken();
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch (err) {
        console.error(err);
      }
    };

    initAuth();
  }, []);

  const authFetch = async (url, options = {}) => {
    if (!accessToken) throw new Error("No access token available");
    const res = await fetchWithToken(url, accessToken, options, setAccessToken);
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
