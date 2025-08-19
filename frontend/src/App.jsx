import GoogleLoginButton from './GoogleLoginButton.jsx';

function App() {

  console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <GoogleLoginButton />
    </div>
  );
}

export default App;
