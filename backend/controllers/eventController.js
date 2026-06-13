import Event from '../models/Event.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const categoryFilter = req.query.category ? { category: req.query.category } : {};

    const events = await Event.find({ ...keyword, ...categoryFilter })
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    next(error);
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');

    if (event) {
      res.json(event);
    } else {
      res.status(404);
      throw new Error('Event not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Organizer
export const createEvent = async (req, res, next) => {
  try {
    const { title, description, category, venue, date, time, capacity } = req.body;

    const bannerImage = req.file ? req.file.path : '';

    const event = new Event({
      title,
      description,
      category,
      venue,
      date,
      time,
      capacity,
      bannerImage,
      organizer: req.user._id,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Organizer
export const updateEvent = async (req, res, next) => {
  try {
    const { title, description, category, venue, date, time, capacity, status } = req.body;

    const event = await Event.findById(req.params.id);

    if (event) {
      // Check if user is the organizer or admin
      if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
        res.status(403);
        throw new Error('Not authorized to update this event');
      }

      event.title = title || event.title;
      event.description = description || event.description;
      event.category = category || event.category;
      event.venue = venue || event.venue;
      event.date = date || event.date;
      event.time = time || event.time;
      event.capacity = capacity || event.capacity;
      event.status = status || event.status;

      if (req.file) {
        event.bannerImage = req.file.path;
      }

      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404);
      throw new Error('Event not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Organizer
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      // Check if user is the organizer or admin
      if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
        res.status(403);
        throw new Error('Not authorized to delete this event');
      }

      await event.deleteOne();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404);
      throw new Error('Event not found');
    }
  } catch (error) {
    next(error);
  }
};
