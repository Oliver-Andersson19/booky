import GoogleLoginButton from './components/GoogleLoginButton.jsx';
import RefreshToken from './components/RefreshToken.jsx';

function App() {

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <GoogleLoginButton />
      <RefreshToken></RefreshToken>
    </div>
  );
}

export default App;
