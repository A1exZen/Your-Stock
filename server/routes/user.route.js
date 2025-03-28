import express from 'express';

import {
	deleteUser,
	signOutUser,
	updateUser,
	getUsers,
	getUser,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/get-users', verifyToken, getUsers);

router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signOutUser);

export default router;
