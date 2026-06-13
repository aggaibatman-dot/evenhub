import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { v2 as cloudinary } from 'cloudinary';

export const generateCertificatePDF = async (participantName, eventName, date, verificationCode) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Title
    page.drawText('Certificate of Attendance', {
      x: 120,
      y: height - 100,
      size: 30,
      font,
      color: rgb(0, 0.53, 0.71),
    });

    // Subtitle
    page.drawText('This is to certify that', {
      x: 220,
      y: height - 150,
      size: 16,
      font: regularFont,
    });

    // Participant Name
    page.drawText(participantName, {
      x: width / 2 - (participantName.length * 8), // approximate center
      y: height - 200,
      size: 24,
      font,
    });

    // Event Info
    page.drawText(`has successfully attended ${eventName}`, {
      x: 100,
      y: height - 250,
      size: 16,
      font: regularFont,
    });

    // Date
    page.drawText(`Date: ${new Date(date).toLocaleDateString()}`, {
      x: 230,
      y: height - 290,
      size: 14,
      font: regularFont,
    });

    // Verification Code
    page.drawText(`Verification Code: ${verificationCode}`, {
      x: 50,
      y: 30,
      size: 10,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5),
    });

    const pdfBytes = await pdfDoc.save();

    // Upload PDF to Cloudinary
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'eventhub_certificates',
          format: 'pdf',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );

      uploadStream.end(pdfBytes);
    });
  } catch (error) {
    console.error('Error generating certificate', error);
    throw new Error('Failed to generate certificate');
  }
};
