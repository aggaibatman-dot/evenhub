import express from 'express';
import { getAnalytics, getUsers, approveOrganizer } from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/analytics', protect, admin, getAnalytics);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id/approve', protect, admin, approveOrganizer);

export default router;
