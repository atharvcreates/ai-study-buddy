import express from 'express';
import { saveSession, getStats } from '../controllers/pomodoroController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/session', protect, saveSession);
router.get('/stats', protect, getStats);

export default router;
