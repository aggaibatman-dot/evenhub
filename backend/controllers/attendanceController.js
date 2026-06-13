import crypto from 'crypto';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import Attendance from '../models/Attendance.js';
import Certificate from '../models/Certificate.js';
import { generateQRData, generateQRImage, verifyQRData } from '../utils/qrHelper.js';
import { generateCertificatePDF } from '../utils/pdfGenerator.js';
import { sendEmail } from '../utils/emailService.js';

// @desc    Register for an event
// @route   POST /api/attendance/register/:eventId
// @access  Private/Participant
export const registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }

    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      event: req.params.eventId,
    });

    if (existingRegistration) {
      res.status(400);
      throw new Error('Already registered for this event');
    }

    const qrData = generateQRData(req.user._id, event._id);
    const qrCodeImage = await generateQRImage(qrData);

    const registration = new Registration({
      user: req.user._id,
      event: event._id,
      qrCodeData: qrData,
      qrCodeImage,
    });

    await registration.save();

    // Send email
    await sendEmail({
      email: req.user.email,
      subject: `Registration Confirmed: ${event.title}`,
      message: `You have successfully registered for ${event.title}.`,
      htmlMessage: `<p>You have successfully registered for <strong>${event.title}</strong>.</p><p>Please find your QR code attached or view it in your dashboard.</p><img src="${qrCodeImage}" alt="QR Code" />`,
    });

    res.status(201).json(registration);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark attendance (Scan QR)
// @route   POST /api/attendance/scan
// @access  Private/Organizer
export const scanQRCode = async (req, res, next) => {
  try {
    const { qrDataString } = req.body;
    
    const verificationResult = verifyQRData(qrDataString);
    if (!verificationResult.valid) {
      res.status(400);
      throw new Error(verificationResult.message);
    }

    const { userId, eventId } = verificationResult.data;

    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }

    // Check if organizer owns this event
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      res.status(403);
      throw new Error('Not authorized to mark attendance for this event');
    }

    const registration = await Registration.findOne({ user: userId, event: eventId });
    if (!registration) {
      res.status(400);
      throw new Error('User not registered for this event');
    }

    const existingAttendance = await Attendance.findOne({ user: userId, event: eventId });
    if (existingAttendance) {
      res.status(400);
      throw new Error('Attendance already marked');
    }

    const attendance = new Attendance({
      user: userId,
      event: eventId,
      verifiedBy: req.user._id,
    });
    await attendance.save();

    // Generate Certificate
    const verificationCode = crypto.randomBytes(6).toString('hex').toUpperCase();
    
    // We populate the user to get the name
    await registration.populate('user', 'name email');
    
    const certificateUrl = await generateCertificatePDF(
      registration.user.name,
      event.title,
      event.date,
      verificationCode
    );

    const certificate = new Certificate({
      user: userId,
      event: eventId,
      certificateUrl,
      verificationCode
    });
    await certificate.save();

    // Send email with certificate
    await sendEmail({
      email: registration.user.email,
      subject: `Attendance Confirmed & Certificate: ${event.title}`,
      message: `Your attendance has been marked for ${event.title}. You can download your certificate.`,
      htmlMessage: `<p>Your attendance has been marked for <strong>${event.title}</strong>.</p><p>You can view your certificate here: <a href="${certificateUrl}">Download Certificate</a></p>`,
    });

    res.status(200).json({ message: 'Attendance marked successfully', attendance, certificate });
  } catch (error) {
    next(error);
  }
};
