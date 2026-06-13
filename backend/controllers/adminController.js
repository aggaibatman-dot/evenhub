import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Attendance from '../models/Attendance.js';

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();
    const totalAttendances = await Attendance.countDocuments();

    const recentEvents = await Event.find().sort({ createdAt: -1 }).limit(5);

    const attendanceRate = totalRegistrations === 0 ? 0 : ((totalAttendances / totalRegistrations) * 100).toFixed(2);

    res.json({
      totalUsers,
      totalEvents,
      totalRegistrations,
      totalAttendances,
      attendanceRate,
      recentEvents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve organizer
// @route   PUT /api/admin/users/:id/approve
// @access  Private/Admin
export const approveOrganizer = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user && user.role === 'Organizer') {
      user.isApproved = true;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404);
      throw new Error('Organizer not found');
    }
  } catch (error) {
    next(error);
  }
};
