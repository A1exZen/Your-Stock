import express from 'express';
import {
	createCustomer,
	deleteCustomer,
	getCustomers,
	getCustomer,
	updateCustomer,
} from '../controllers/customer.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createCustomer);
router.get('/get-all', getCustomers);
router.get('/:customerId', getCustomer);
router.delete('/delete/:supplierId/:userId', verifyToken, deleteCustomer);
router.put('/update/:supplierId/:userId', verifyToken, updateCustomer);

export default router;
