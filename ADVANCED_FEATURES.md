# Advanced Features Documentation

## MongoDB Integration

### Models

**Booking Model**
```javascript
{
  fullName: String (required),
  phone: String (required, validated),
  email: String (required, validated),
  service: String (enum),
  date: Date (required),
  time: String (required),
  details: String,
  status: String (pending, confirmed, in-progress, completed, cancelled),
  paymentStatus: String (pending, paid, failed, refunded),
  amount: Number,
  stripePaymentId: String,
  assignedTo: ObjectId (ref: User),
  notes: String,
  timestamps: true
}
```

**User Model**
```javascript
{
  fullName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (user, admin, worker),
  phone: String,
  avatar: String,
  isActive: Boolean,
  timestamps: true
}
```

**Payment Model**
```javascript
{
  bookingId: ObjectId (ref: Booking),
  userId: ObjectId (ref: User),
  amount: Number,
  currency: String,
  stripePaymentId: String,
  status: String (pending, succeeded, failed, refunded),
  description: String,
  metadata: Object,
  timestamps: true
}
```

---

## Authentication System

### JWT Tokens

- Tokens expire in 7 days
- Include user ID, email, and role
- Required for protected endpoints

### Middleware

**authMiddleware**
- Verifies JWT token
- Attaches user to request
- Returns 401 if invalid

**adminMiddleware**
- Checks if user role is 'admin'
- Returns 403 if not admin
- Must be used after authMiddleware

### Usage Example

```javascript
router.put(
  '/:id',
  authMiddleware,    // Verify token
  adminMiddleware,   // Check admin role
  updateBooking      // Handler
);
```

---

## Stripe Payment Integration

### Payment Flow

1. **Create Intent**
   - Client sends booking ID and amount
   - Server creates Stripe PaymentIntent
   - Returns client secret

2. **Confirm Payment**
   - Client uses client secret to process payment
   - Server receives confirmation
   - Updates booking and payment status

### API Endpoints

**POST /api/payments/intent**
- Creates payment intent
- Requires authentication
- Returns client secret

**POST /api/payments/confirm**
- Confirms payment
- Updates booking status
- Requires authentication

**GET /api/payments/:id**
- Gets payment details
- Requires authentication

---

## Email & SMS Notifications

### Notification Service

**sendBookingConfirmation(booking, email)**
- Sends when booking is created
- Includes booking ID and details

**sendStatusUpdate(booking, email, phone)**
- Sends when status changes
- Sends both email and SMS
- SMS via Twilio

### Email Templates

Emails include:
- Booking confirmation
- Status updates
- Payment receipts
- Admin notifications

---

## Admin Dashboard Features

### Statistics

```
GET /api/bookings/stats/all

Response:
{
  "statistics": {
    "totalBookings": 150,
    "pendingBookings": 25,
    "completedBookings": 120,
    "revenue": 5000
  }
}
```

### Booking Management

- View all bookings
- Filter by status or email
- Update booking status
- Delete bookings
- Assign to workers
- Add notes

---

## Testing

### Jest Configuration

Tests run with:
```bash
npm test
```

### Test Coverage

- Booking CRUD operations
- Authentication (register, login)
- Error handling
- Validation

### Running Specific Tests

```bash
# Booking tests
npm test tests/booking.test.js

# Auth tests
npm test tests/auth.test.js

# Watch mode
npm run test:watch
```

---

## Error Monitoring with Sentry

### Automatic Error Tracking

- All errors are captured
- Stack traces recorded
- User context included
- Request details saved

### Sentry Dashboard

1. Go to https://sentry.io
2. View error issues
3. Check stack traces
4. Get notifications

---

## Security Features

### Implemented

✅ Password hashing (bcryptjs)
✅ JWT authentication
✅ Role-based access control
✅ Rate limiting
✅ Helmet (HTTP headers)
✅ CORS validation
✅ Input validation
✅ Email validation
✅ Phone validation
✅ Environment variables

### Recommendations

- [ ] Add 2FA for admin accounts
- [ ] Implement API key system
- [ ] Add request logging
- [ ] Enable HTTPS redirects
- [ ] Setup firewall rules
- [ ] Regular security audits

---

## Performance Optimization

### Database Indexes

```javascript
bookingSchema.index({ email: 1, status: 1 });
bookingSchema.index({ date: 1 });
```

This speeds up common queries.

### Caching Strategies

- Cache admin dashboard stats
- Cache user profiles
- Use Redis for sessions (optional)

### Load Testing

Use tools like:
- Apache JMeter
- LoadRunner
- Locust

---

## Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Mobile app (React Native/Flutter)
- [ ] Advanced analytics
- [ ] Booking calendar
- [ ] Payment plans
- [ ] Loyalty program
- [ ] Partner integrations
- [ ] Multi-language support
- [ ] AI chatbot support
- [ ] Predictive analytics
