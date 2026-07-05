import { Router } from 'express';
import * as authController from './auth.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = Router();

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);

// Routes privées (protégées par verifyToken)
router.get('/me', verifyToken, authController.getMe);
router.get('/users', verifyToken, authController.getAllUsers);

export default router;
