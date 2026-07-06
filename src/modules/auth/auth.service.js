import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../config/db.js';
import { env } from '../../config/env.js';

export const registerUser = async (userData) => {
  const { email, password, first_name, last_name } = userData;
  const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (userCheck.rows.length > 0) throw new Error('Un utilisateur avec cet email existe déjà');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const query = `
    INSERT INTO users (email, password_hash, first_name, last_name) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id, email, first_name, last_name, created_at
  `;
  const result = await pool.query(query, [email, hashedPassword, first_name, last_name]);
  return result.rows[0];
};

export const loginUser = async (email, password) => {
  // 1. Vérifier si l'utilisateur existe
  const result = await pool.query('SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) throw new Error('Identifiants invalides');

  // 2. Vérifier le mot de passe
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) throw new Error('Identifiants invalides');

  // Helper to determine if an email belongs to a system admin
  const isAdminEmail = (email) => {
    if (!email) return false;
    const lower = email.toLowerCase();
    return lower === 'janesgiges23@gmail.com' || lower === 'epolegeorgesroland@gmail.com';
  };

  // 3. Générer les Tokens
  const role = isAdminEmail(user.email) ? 'admin' : 'client';
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role },
    env.jwtAccessSecret,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    env.jwtRefreshSecret,
    { expiresIn: '7d' }
  );

  // On supprime le hash avant de renvoyer l'objet utilisateur
  delete user.password_hash;
  user.role = role;
  
  return { user, accessToken, refreshToken };
};

export const getUserById = async (id) => {
  const result = await pool.query('SELECT id, email, first_name, last_name, created_at FROM users WHERE id = $1', [id]);
  const user = result.rows[0];
  if (user) {
    const lower = user.email.toLowerCase();
    user.role = (lower === 'janesgiges23@gmail.com' || lower === 'epolegeorgesroland@gmail.com') ? 'admin' : 'client';
  }
  return user;
};

export const getAllUsers = async () => {
  const result = await pool.query(
    'SELECT id, email, first_name, last_name, created_at FROM users WHERE LOWER(email) != $1 AND LOWER(email) != $2 ORDER BY created_at DESC', 
    ['janesgiges23@gmail.com', 'epolegeorgesroland@gmail.com']
  );
  return result.rows;
};
