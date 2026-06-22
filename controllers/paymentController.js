const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// Create payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: bookingId.toString(),
      },
    });

    // Save payment record
    const payment = new Payment({
      bookingId,
      userId: req.user.id,
      amount,
      stripePaymentId: paymentIntent.id,
      status: 'pending',
    });
    await payment.save();

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment',
    });
  }
};

// Confirm payment
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Update payment status
    const payment = await Payment.findOneAndUpdate(
      { stripePaymentId: paymentIntentId },
      { status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'failed' },
      { new: true }
    );

    if (paymentIntent.status === 'succeeded') {
      // Update booking payment status
      await Booking.findByIdAndUpdate(
        payment.bookingId,
        { paymentStatus: 'paid', amount: payment.amount }
      );
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming payment',
    });
  }
};

// Get payment by ID
const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment',
    });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPayment,
};