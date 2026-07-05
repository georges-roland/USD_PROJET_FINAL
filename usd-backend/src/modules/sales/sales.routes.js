import { Router } from 'express';
import * as salesController from './sales.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = Router();

// Routes Client
router.post('/orders', verifyToken, salesController.checkout);
router.get('/orders', verifyToken, salesController.getMyOrders);

// Routes Administrateur
router.get('/all-orders', verifyToken, salesController.getAllOrders);
router.put('/orders/:id/status', verifyToken, salesController.updateOrderStatus);

export default router;
