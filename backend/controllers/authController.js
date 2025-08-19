import jwt from 'jsonwebtoken';

export const oauthGoogle = async (req, res) => {

  const JWT_SECRET = process.env.JWT_SECRET;
  
  try {
    const { id_token } = req.body;
    if (!id_token) return res.status(400).json({ message: 'No ID token provided' });

    // Verify token with Google
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`);
    if (!googleRes.ok) return res.status(400).json({ message: 'Invalid Google token' });

    const googleData = await googleRes.json();
    const { email, sub: googleId } = googleData;

    // -------------------------------
    // DB stuff commented out for now
    // -------------------------------
    // const userRes = await pool.query(
    //   'SELECT * FROM users WHERE oauth_provider=$1 AND oauth_id=$2',
    //   ['google', googleId]
    // );
    // let user = userRes.rows[0];
    // if (!user) {
    //   const insertRes = await pool.query(
    //     'INSERT INTO users (email, oauth_provider, oauth_id) VALUES ($1, $2, $3) RETURNING *',
    //     [email, 'google', googleId]
    //   );
    //   user = insertRes.rows[0];
    // }

    // Issue JWT with minimal payload
    const token = jwt.sign({ email, googleId }, JWT_SECRET, { expiresIn: '1h' });

    // Respond with token and basic info
    res.json({
      token,
      email,
      googleId,
      // user, // uncomment when using DB
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Google OAuth failed' });
  }
};
