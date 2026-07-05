import { Router } from 'express';
import * as catalogController from './catalog.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/upload.middleware.js';

const router = Router();

router.get('/products', catalogController.getProducts);
router.post('/products', verifyToken, upload.single('image'), catalogController.createProduct);
router.put('/products/:id', verifyToken, upload.single('image'), catalogController.updateProduct);
router.delete('/products/:id', verifyToken, catalogController.deleteProduct);

export default router;
