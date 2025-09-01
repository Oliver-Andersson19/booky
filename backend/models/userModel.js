import pool from '../db/db.js';

export const findByEmail = async (email) => {
  const res = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  return res.rows[0];
};

export const findByOauth = async (provider, oauthId) => {
  const res = await pool.query(
    'SELECT * FROM users WHERE oauth_provider=$1 AND oauth_id=$2',
    [provider, oauthId]
  );
  return res.rows[0];
};

export const createOauthUser = async ({ email, provider, oauthId, name }) => {
  const res = await pool.query(
    'INSERT INTO users (email, name, oauth_provider, oauth_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [email, name, provider, oauthId]
  );
  return res.rows[0];
};

export const createEmailUser = async ({ email, name, passwordHash }) => {
  const res = await pool.query(
    'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING *',
    [email, name, passwordHash]
  );
  return res.rows[0];
};

// Save/update refresh token for a user
export const saveRefreshToken = async ({userId, refreshToken}) => {
  const res = await pool.query(
    'UPDATE users SET refresh_token=$1 WHERE id=$2',
    [refreshToken, userId]
  );
  return res.rows[0];
}

// Get user by refresh token
export const findByRefreshToken = async (refreshToken) => {
  const res = await pool.query(
    'SELECT * FROM users WHERE refresh_token=$1',
    [refreshToken]
  );
  return res.rows[0];
}