import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  token = req.cookies?.jwt;

  // Fallback to Bearer token if cookie is not present (for API consumption)
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(401);
    next(new Error('Not authorized as an admin'));
  }
};

const organizer = (req, res, next) => {
  if (req.user && (req.user.role === 'Organizer' || req.user.role === 'Admin')) {
    if (req.user.role === 'Organizer' && !req.user.isApproved) {
      res.status(403);
      return next(new Error('Organizer account pending approval'));
    }
    next();
  } else {
    res.status(401);
    next(new Error('Not authorized as an organizer'));
  }
};

export { protect, admin, organizer };
