const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// Public routes
router.post('/', bookingController.createBooking);
router.get('/:id', bookingController.getBooking);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, bookingController.getBookings);
router.put('/:id', authMiddleware, adminMiddleware, bookingController.updateBooking);
router.delete('/:id', authMiddleware, adminMiddleware, bookingController.deleteBooking);
router.get('/stats/all', authMiddleware, adminMiddleware, bookingController.getStatistics);

module.exports = router;