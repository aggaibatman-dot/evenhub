import express from 'express';
import { registerForEvent, scanQRCode } from '../controllers/attendanceController.js';
import { protect, organizer } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register/:eventId', protect, registerForEvent);
router.post('/scan', protect, organizer, scanQRCode);

export default router;
