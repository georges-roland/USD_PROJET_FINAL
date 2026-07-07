import * as authService from './auth.service.js';
import { env } from '../../config/env.js';

export const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ success: true, message: 'Utilisateur créé avec succès', user });
  } catch (error) {
    if (error.message.includes('existe déjà')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error('[AUTH ERROR]', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

    // Sécurité : Configuration stricte du cookie HTTP-Only pour le Refresh Token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === 'production', // true en production (HTTPS), false en dev (HTTP)
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
    });

    res.status(200).json({
      success: true,
      access_token: accessToken,
      user
    });
  } catch (error) {
    if (error.message === 'Identifiants invalides') {
      return res.status(401).json({ success: false, message: error.message });
    }
    console.error('[LOGIN ERROR]', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};

export const getMe = async (req, res) => {
  try {
    // L'ID provient du token décodé par le middleware, il est donc 100% fiable
    const user = await authService.getUserById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('[GET ME ERROR]', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await authService.getAllUsers();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('[GET ALL USERS ERROR]', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};
