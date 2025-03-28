import express from 'express';
import {
	createMaterial,
	deleteMaterial,
	getMaterials,
	updateMaterial,
	updateMaterialQuantity,
} from '../controllers/material.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createMaterial);
router.get('/get-all', getMaterials);
router.delete('/delete/:materialId/:userId', verifyToken, deleteMaterial);
router.put('/update/:materialId/:userId', verifyToken, updateMaterial);
router.put('/update-quantity/:userId', verifyToken, updateMaterialQuantity);

export default router;
