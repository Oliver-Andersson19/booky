// frontend/src/context/authContext.js
import { refreshAccessToken } from "../services/authService.js";
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


  return (
    <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
