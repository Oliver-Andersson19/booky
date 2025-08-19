import { GoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton() {

  const handleSuccess = async (credentialResponse) => {
    const id_token = credentialResponse.credential;

    try {
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token }),
      });

      if (!res.ok) throw new Error('Login failed');

      const data = await res.json();
      console.log(data); // JWT + email + googleId
    
    } catch (err) {
      console.error(err);
    }
  };

  const handleError = () => {
    console.log('Login Failed');
  }

  return <>
    <div style={{colorScheme: 'dark'}}>
      <GoogleLogin 
        onSuccess={handleSuccess}
        onError={handleError}
        theme="outline"
      />;
    </div>
  </>

}
