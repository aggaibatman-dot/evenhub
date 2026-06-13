import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Event',
    },
    qrCodeData: {
      type: String,
      required: true,
    },
    qrCodeImage: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Registered', 'Cancelled'],
      default: 'Registered',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate registrations
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
