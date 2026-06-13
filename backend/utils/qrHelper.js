import QRCode from 'qrcode';
import crypto from 'crypto';

export const generateQRData = (userId, eventId) => {
  const secureToken = crypto.randomBytes(16).toString('hex');
  // Token expires in 24 hours for security
  const expiryTimestamp = Date.now() + 24 * 60 * 60 * 1000;
  
  const qrData = JSON.stringify({
    userId,
    eventId,
    secureToken,
    expiryTimestamp
  });
  
  return qrData;
};

export const generateQRImage = async (qrData) => {
  try {
    const qrImage = await QRCode.toDataURL(qrData);
    return qrImage;
  } catch (error) {
    console.error('Error generating QR code', error);
    throw new Error('QR Code generation failed');
  }
};

export const verifyQRData = (qrDataString) => {
  try {
    const data = JSON.parse(qrDataString);
    if (Date.now() > data.expiryTimestamp) {
      return { valid: false, message: 'QR Code has expired' };
    }
    return { valid: true, data };
  } catch (error) {
    return { valid: false, message: 'Invalid QR Code format' };
  }
};
