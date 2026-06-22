const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { sendBookingConfirmation, sendStatusUpdate } = require('../services/notificationService');

// Create booking
const createBooking = async (req, res) => {
  try {
    const { fullName, phone, email, service, date, time, details, amount } = req.body;

    // Validation
    if (!fullName || !phone || !email || !service || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const booking = new Booking({
      fullName,
      phone,
      email,
      service,
      date: new Date(date),
      time,
      details,
      amount: amount || 0,
    });

    await booking.save();

    // Send confirmation email
    await sendBookingConfirmation(booking, email);

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
};

// Get all bookings
const getBookings = async (req, res) => {
  try {
    const { status, email, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (email) query.email = email;

    const bookings = await Booking.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
    });
  }
};

// Get single booking
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

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
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
    });
  }
};

// Update booking
const updateBooking = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Send status update notification
    if (status) {
      await sendStatusUpdate(booking, booking.email, booking.phone);
    }

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
    });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
    });
  }
};

// Get booking statistics
const getStatistics = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const revenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        totalBookings,
        pendingBookings,
        completedBookings,
        revenue: revenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  getStatistics,
};