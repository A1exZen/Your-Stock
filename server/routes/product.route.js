import express from 'express';
import {
	createProduct,
	deleteProduct,
	getProducts,
	updateProduct,
} from '../controllers/product.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createProduct);
router.get('/get-all', getProducts);
router.delete('/delete/:productId/:userId', verifyToken, deleteProduct);
router.put('/update/:productId/:userId', verifyToken, updateProduct);

export default router;
