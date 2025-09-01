import GoogleLoginButton from './components/GoogleLoginButton.jsx';
import RefreshToken from './components/RefreshToken.jsx';
import { useAuth } from './context/authContext.jsx';

function App() {

  const { user } = useAuth();

  console.log(user)

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <GoogleLoginButton />
      <RefreshToken></RefreshToken>
    </div>
  );
}

export default App;
