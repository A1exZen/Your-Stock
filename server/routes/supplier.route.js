import express from 'express'
import {
	createSupplier,
	deleteSupplier, getSupplier,
	getSuppliers,
	updateSupplier
} from '../controllers/supplier.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.post('/create', verifyToken, createSupplier)
router.get('/get-all', getSuppliers)
router.get('/get-one/:supplierId', getSupplier)
router.delete(
	'/delete/:supplierId/:userId',
	verifyToken,
	deleteSupplier
)
router.put('/update/:supplierId/:userId', verifyToken, updateSupplier)

export default router
