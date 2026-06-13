import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `EventHub <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.htmlMessage,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending failed', error);
    // don't throw error to prevent breaking the flow if email fails
  }
};
