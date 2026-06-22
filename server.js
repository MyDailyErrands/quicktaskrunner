const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Email configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Bookings storage (in-memory for demo, use database in production)
const bookings = [];

// Ensure bookings.json exists
const bookingsFile = path.join(__dirname, 'data', 'bookings.json');
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(bookingsFile)) {
  fs.writeFileSync(bookingsFile, JSON.stringify([]));
}

// Helper function to load bookings from file
function loadBookings() {
  try {
    const data = fs.readFileSync(bookingsFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading bookings:', error);
    return [];
  }
}

// Helper function to save bookings to file
function saveBookings(data) {
  try {
    fs.writeFileSync(bookingsFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving bookings:', error);
  }
}

// Routes

// Create a new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { fullName, phone, email, service, date, time, details } = req.body;

    // Validation
    if (!fullName || !phone || !service || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Create booking object
    const booking = {
      id: Date.now().toString(),
      fullName,
      phone,
      email: email || 'Not provided',
      service,
      date,
      time,
      details: details || 'No additional details',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Save to file
    const allBookings = loadBookings();
    allBookings.push(booking);
    saveBookings(allBookings);

    // Send confirmation email to customer
    if (email) {
      const customerEmailHtml = `
        <h2>Booking Confirmation</h2>
        <p>Hi ${fullName},</p>
        <p>Your errand booking has been received!</p>
        <hr>
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Booking ID:</strong> ${booking.id}</li>
          <li><strong>Service:</strong> ${service}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
          <li><strong>Status:</strong> ${booking.status}</li>
        </ul>
        <hr>
        <p>We'll contact you at ${phone} to confirm details.</p>
        <p>Thank you for choosing QuickTask Runner!</p>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'QuickTask Runner - Booking Confirmation',
        html: customerEmailHtml,
      });
    }

    // Send notification email to admin
    const adminEmailHtml = `
      <h2>New Booking Received</h2>
      <h3>Customer Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${fullName}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Email:</strong> ${email || 'Not provided'}</li>
      </ul>
      <h3>Booking Details:</h3>
      <ul>
        <li><strong>Booking ID:</strong> ${booking.id}</li>
        <li><strong>Service:</strong> ${service}</li>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Details:</strong> ${details || 'No additional details'}</li>
      </ul>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Booking: ${service}`,
      html: adminEmailHtml,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message,
    });
  }
});

// Get all bookings (admin only)
app.get('/api/bookings', (req, res) => {
  try {
    const allBookings = loadBookings();
    res.status(200).json({
      success: true,
      bookings: allBookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
    });
  }
});

// Get a specific booking
app.get('/api/bookings/:id', (req, res) => {
  try {
    const { id } = req.params;
    const allBookings = loadBookings();
    const booking = allBookings.find((b) => b.id === id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
    });
  }
});

// Update booking status
app.put('/api/bookings/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const allBookings = loadBookings();
    const bookingIndex = allBookings.findIndex((b) => b.id === id);

    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    allBookings[bookingIndex].status = status;
    allBookings[bookingIndex].updatedAt = new Date().toISOString();

    saveBookings(allBookings);

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      booking: allBookings[bookingIndex],
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
    });
  }
});

// Delete booking
app.delete('/api/bookings/:id', (req, res) => {
  try {
    const { id } = req.params;
    let allBookings = loadBookings();
    const bookingIndex = allBookings.findIndex((b) => b.id === id);

    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const deletedBooking = allBookings.splice(bookingIndex, 1);
    saveBookings(allBookings);

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
      booking: deletedBooking[0],
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`QuickTask Runner server running on port ${PORT}`);
});
