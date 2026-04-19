import express from 'express';
import { registerUser, loginUser, getMe, updateMe } from '../controllers/authController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateMe);

export default router;
