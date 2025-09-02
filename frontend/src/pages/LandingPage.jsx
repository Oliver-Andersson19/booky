import React from 'react'
import GoogleLoginButton from '../components/GoogleLoginButton'
import RefreshToken from '../components/RefreshToken'

function LandingPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <GoogleLoginButton />
        <RefreshToken></RefreshToken>
    </div>
  )
}

export default LandingPage
