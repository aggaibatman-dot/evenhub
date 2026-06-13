import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { protect, organizer } from '../middlewares/authMiddleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, organizer, upload.single('bannerImage'), createEvent);

router.route('/:id')
  .get(getEventById)
  .put(protect, organizer, upload.single('bannerImage'), updateEvent)
  .delete(protect, organizer, deleteEvent);

export default router;
