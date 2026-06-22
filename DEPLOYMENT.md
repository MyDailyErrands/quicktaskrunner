# QuickTask Runner - Complete Deployment Guide

## Table of Contents
1. [Local Development](#local-development)
2. [Heroku Deployment](#heroku-deployment)
3. [MongoDB Setup](#mongodb-setup)
4. [Stripe Integration](#stripe-integration)
5. [Twilio SMS Setup](#twilio-sms-setup)
6. [Environment Variables](#environment-variables)
7. [Testing](#testing)
8. [Monitoring](#monitoring)

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Git

### Setup Steps

1. **Clone Repository**
```bash
git clone https://github.com/MyDailyErrands/quicktaskrunner.git
cd quicktaskrunner
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment**
```bash
cp .env.example .env
```

4. **Start MongoDB** (if local)
```bash
mongod
```

5. **Start Development Server**
```bash
npm run dev
```

Server runs on `http://localhost:3000`

---

## Heroku Deployment

### Prerequisites
- Heroku account (free or paid)
- Heroku CLI installed

### Step-by-Step Deployment

1. **Login to Heroku**
```bash
heroku login
```

2. **Create Heroku App**
```bash
heroku create your-app-name
```

3. **Add MongoDB Atlas URI**
```bash
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quicktask-runner
```

4. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-key
heroku config:set STRIPE_SECRET_KEY=sk_live_your_key
heroku config:set STRIPE_PUBLISHABLE_KEY=pk_live_your_key
heroku config:set EMAIL_SERVICE=gmail
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set ADMIN_EMAIL=admin@quicktaskrunner.com
heroku config:set TWILIO_ACCOUNT_SID=your_account_sid
heroku config:set TWILIO_AUTH_TOKEN=your_auth_token
heroku config:set TWILIO_PHONE_NUMBER=+1234567890
heroku config:set SENTRY_DSN=your-sentry-dsn
```

5. **Deploy**
```bash
git push heroku main
```

6. **Verify Deployment**
```bash
heroku logs --tail
```

Your app is now live at: `https://your-app-name.herokuapp.com`

---

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended)

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
2. **Create Account** and verify email
3. **Create New Project**
4. **Create Cluster**
   - Select Free tier
   - Choose region closest to you
   - Click "Create Cluster"
5. **Add Database User**
   - Username: `admin`
   - Password: (generate strong password)
   - Save credentials
6. **Whitelist IP**
   - Click "Network Access"
   - Add IP Address: `0.0.0.0/0` (allows all, use specific IPs in production)
7. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy URI: `mongodb+srv://admin:password@cluster.mongodb.net/quicktask-runner`
8. **Add to .env**
```
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/quicktask-runner
```

### Option 2: Local MongoDB

1. **Install MongoDB**: https://docs.mongodb.com/manual/installation/
2. **Start MongoDB**
```bash
mongod
```
3. **Use Local Connection**
```
MONGODB_URI=mongodb://localhost:27017/quicktask-runner
```

---

## Stripe Integration

### Setup Steps

1. **Create Stripe Account**: https://stripe.com
2. **Go to Dashboard**: https://dashboard.stripe.com
3. **Get API Keys**
   - Test Mode (development):
     - Publishable Key: `pk_test_...`
     - Secret Key: `sk_test_...`
   - Live Mode (production):
     - Publishable Key: `pk_live_...`
     - Secret Key: `sk_live_...`
4. **Add to .env**
```
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```
5. **Test with Card Numbers**
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Expiry: any future date
   - CVC: any 3 digits

---

## Twilio SMS Setup

### Configuration

1. **Create Twilio Account**: https://www.twilio.com/console
2. **Get Credentials**
   - Account SID
   - Auth Token
   - Phone Number (get a Twilio number)
3. **Add to .env**
```
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Environment Variables

### Complete .env Setup

```bash
# Server
PORT=3000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/quicktask-runner

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@quicktaskrunner.com

# Stripe
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_key

# Twilio
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# Sentry
SENTRY_DSN=your-sentry-dsn
```

---

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test tests/booking.test.js
```

### Test Examples

The following endpoints are tested:
- POST /api/bookings - Create booking
- GET /api/bookings - Get all bookings
- GET /api/bookings/:id - Get single booking
- POST /api/auth/register - User registration
- POST /api/auth/login - User login

---

## Monitoring

### Sentry Error Tracking

1. **Create Sentry Account**: https://sentry.io
2. **Create Project**
   - Select Node.js
   - Create project
3. **Copy DSN**
4. **Add to .env**
```
SENTRY_DSN=your-sentry-dsn
```

All errors are now automatically tracked and reported to Sentry.

### View Logs

**Heroku Logs:**
```bash
# Real-time logs
heroku logs --tail

# View past logs
heroku logs -n 100
```

---

## Security Best Practices

✅ Use HTTPS in production
✅ Rotate JWT_SECRET regularly
✅ Never commit .env files
✅ Use strong passwords (20+ characters)
✅ Enable 2FA on all accounts
✅ Use environment-specific credentials
✅ Implement rate limiting (already done)
✅ Validate all user inputs
✅ Use CORS carefully (allow specific origins)

---

## API Documentation

### Authentication Endpoints

**Register User**
```
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt-token",
  "user": { ... }
}
```

**Login User**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt-token",
  "user": { ... }
}
```

### Booking Endpoints

**Create Booking**
```
POST /api/bookings
Content-Type: application/json

{
  "fullName": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "service": "Grocery Shopping",
  "date": "2026-06-25",
  "time": "14:00",
  "details": "Buy milk and eggs",
  "amount": 50
}
```

**Get All Bookings** (Admin only)
```
GET /api/bookings?status=pending&page=1&limit=10
Authorization: Bearer {token}
```

### Payment Endpoints

**Create Payment Intent**
```
POST /api/payments/intent
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": "booking-id",
  "amount": 50
}

Response:
{
  "success": true,
  "clientSecret": "pi_...",
  "paymentIntentId": "pi_..."
}
```

---

## Troubleshooting

### MongoDB Connection Error
- Check connection string
- Verify IP whitelist (MongoDB Atlas)
- Ensure credentials are correct

### Email Not Sending
- Enable 2FA on Gmail
- Use App Password (not regular password)
- Check firewall settings

### Stripe Payment Failed
- Use test keys for development
- Check for typos in keys
- Verify webhook setup

### Heroku Deploy Failed
- Check Procfile syntax
- Verify all dependencies are in package.json
- Check build logs: `heroku logs --tail`

---

## Support

For issues or questions:
- Create an issue on GitHub
- Check documentation
- Review error logs in Sentry
