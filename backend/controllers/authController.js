import jwt from 'jsonwebtoken';
import {
  findByOauth,
  createOauthUser,
  saveRefreshToken,
  findByRefreshToken
} from '../models/userModel.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../utils/jwt.js";


// /api/auth/...


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
      console.log('Creating new user from Google OAuth');
      user = await createOauthUser({ email, provider: 'google', oauthId: googleId, name });
    } else {
      console.log('Found existing user from Google OAuth');
    }

    // --- Issue JWT ---
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await saveRefreshToken({userId: user.id, refreshToken});
    // const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // --- Sanitize user object ---
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      oauth_provider: user.oauth_provider,
      created_at: user.created_at
    };

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    res.json({
      accessToken,
      user: safeUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Google OAuth failed' });
  }
};


// Refresh access token using refresh token
export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

  try {
    // Verify the refresh token (will throw if invalid or expired)
    verifyRefreshToken(refreshToken);

    // Find the user in DB by refresh token
    const user = await findByRefreshToken(refreshToken);
    if (!user) return res.status(403).json({ message: "Refresh token is invalid or has been revoked" });

    // Generate a new access token using user's DB info
    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      oauth_provider: user.oauth_provider,
      created_at: user.created_at
    };
    
    res.json({
      accessToken,
      user: safeUser  
    });

  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};