# Quick Start Guide

## 5-Minute Setup

### 1. Clone & Install
```bash
git clone https://github.com/MyDailyErrands/quicktaskrunner.git
cd quicktaskrunner
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

Edit `.env` with:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-secret-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 3. Start Server
```bash
npm run dev
```

Server runs on `http://localhost:3000` ✅

---

## Test API

### Create Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "service": "Grocery Shopping",
    "date": "2026-06-25",
    "time": "14:00",
    "details": "Buy milk and eggs"
  }'
```

### Register Admin
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

---

## Deploy to Heroku

### 1. Install Heroku CLI
https://devcenter.heroku.com/articles/heroku-cli

### 2. Deploy
```bash
heroku login
heroku create your-app-name
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
heroku config:set JWT_SECRET=your-secret
# ... set other env vars ...
git push heroku main
```

### 3. Verify
```bash
heroku logs --tail
```

---

## Key Features

✅ MongoDB Database
✅ JWT Authentication
✅ Stripe Payments
✅ SMS Notifications (Twilio)
✅ Email Notifications
✅ Admin Dashboard
✅ Error Monitoring (Sentry)
✅ Unit Tests
✅ Rate Limiting
✅ Security Headers

---

## Next Steps

1. Integrate Stripe for payments
2. Setup Twilio for SMS
3. Configure admin accounts
4. Deploy to production
5. Monitor with Sentry
6. Setup custom domain
7. Enable HTTPS

---

## Support

- 📖 [Full Deployment Guide](./DEPLOYMENT.md)
- 🔧 [Advanced Features](./ADVANCED_FEATURES.md)
- 📡 [API Reference](./API_REFERENCE.md)
- 🐛 [GitHub Issues](https://github.com/MyDailyErrands/quicktaskrunner/issues)
