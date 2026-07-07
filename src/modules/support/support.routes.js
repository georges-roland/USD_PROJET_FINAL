import { Router } from 'express';
import * as supportController from './support.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = Router();
router.post('/', supportController.sendMessage); 
router.get('/my-messages', verifyToken, supportController.getMyMessages);
router.get('/', verifyToken, supportController.getMessages); 
router.put('/:id/read', verifyToken, supportController.markAsRead); 

export default router;
