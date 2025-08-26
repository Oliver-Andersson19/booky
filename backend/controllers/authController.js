import jwt from 'jsonwebtoken';
import { findByOauth, createOauthUser } from '../models/userModel.js';

// Handles both login and signup via Google OAuth
export const oauthGoogle = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  try {
    const { id_token } = req.body;
    if (!id_token) return res.status(400).json({ message: 'No ID token provided' });


    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`);
    if (!googleRes.ok) return res.status(400).json({ message: 'Invalid Google token' });

    const googleData = await googleRes.json();
    const { email, sub: googleId, name } = googleData;

    
    // --- Find or create user ---
    let user = await findByOauth('google', googleId);
    if (!user) {
      user = await createOauthUser({ email, provider: 'google', oauthId: googleId, name });
    }

    // --- Issue JWT ---
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // --- Sanitize user object ---
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      oauth_provider: user.oauth_provider,
      oauth_id: user.oauth_id,
      created_at: user.created_at
    };

    res.json({
      token,
      user: safeUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Google OAuth failed' });
  }
};
