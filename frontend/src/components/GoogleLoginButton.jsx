import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/authContext.jsx";
import { loginWithGoogle } from "../services/authService.js";

export default function GoogleLoginButton() {
  const { setUser, setAccessToken } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;
    try {
      const data = await loginWithGoogle(googleToken);
      setUser(data.user);
      setAccessToken(data.accessToken);
    } catch (err) {
      console.error(err);
    }
  };

  const handleError = () => console.log("Login Failed");

  return (
    <GoogleLogin onSuccess={handleSuccess} onError={handleError} theme="outline" />
  );
}
