import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    // Save locally instead of uploading to Cloudinary
    const certsDir = path.join(__dirname, '..', 'uploads', 'certificates');
    if (!fs.existsSync(certsDir)) {
      fs.mkdirSync(certsDir, { recursive: true });
    }

    const filename = `cert_${verificationCode}.pdf`;
    const filePath = path.join(certsDir, filename);
    fs.writeFileSync(filePath, pdfBytes);

    // Return a URL path that can be accessed via the static file server
    return `/uploads/certificates/${filename}`;
  } catch (error) {
    console.error('Error generating certificate', error);
    throw new Error('Failed to generate certificate');
  }
};
