import { Router } from 'express';
import * as paymentController from './payment.controller.js';

const router = Router();

router.post('/checkout', paymentController.checkout);

export default router;
