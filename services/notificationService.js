const nodemailer = require('nodemailer');
const twilio = require('twilio');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Initialize Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send booking confirmation email
const sendBookingConfirmation = async (booking, userEmail) => {
  try {
    const emailHtml = `
      <h2>Booking Confirmation</h2>
      <p>Your booking has been confirmed!</p>
      <hr>
      <h3>Details:</h3>
      <ul>
        <li><strong>Booking ID:</strong> ${booking._id}</li>
        <li><strong>Service:</strong> ${booking.service}</li>
        <li><strong>Date:</strong> ${booking.date}</li>
        <li><strong>Time:</strong> ${booking.time}</li>
        <li><strong>Status:</strong> ${booking.status}</li>
      </ul>
      <hr>
      <p>Thank you for choosing QuickTask Runner!</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'QuickTask Runner - Booking Confirmation',
      html: emailHtml,
    });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

// Send SMS notification
const sendSMSNotification = async (phone, message) => {
  try {
    if (!process.env.TWILIO_PHONE_NUMBER) {
      console.warn('Twilio phone number not configured');
      return;
    }

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};

// Send status update
const sendStatusUpdate = async (booking, userEmail, userPhone) => {
  const statusMessages = {
    confirmed: 'Your booking has been confirmed!',
    'in-progress': 'Your errand is in progress',
    completed: 'Your errand has been completed',
    cancelled: 'Your booking has been cancelled',
  };

  const message = statusMessages[booking.status] || 'Your booking status has been updated';

  // Send email
  const emailHtml = `
    <h2>Booking Status Update</h2>
    <p>${message}</p>
    <p>Booking ID: ${booking._id}</p>
    <p>Status: <strong>${booking.status}</strong></p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'QuickTask Runner - Status Update',
    html: emailHtml,
  });

  // Send SMS
  if (userPhone) {
    await sendSMSNotification(userPhone, `QuickTask Runner: ${message}`);
  }
};

module.exports = {
  sendBookingConfirmation,
  sendSMSNotification,
  sendStatusUpdate,
};