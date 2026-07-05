import { Router } from 'express';
import * as statsController from './stats.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = Router();
router.get('/', verifyToken, statsController.getMetrics);
export default router;
