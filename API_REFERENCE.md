# API Reference

## Authentication API

### Register
```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" (optional, default: user)
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "user": { ... }
}
```

### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "fullName": "Jane Doe",
  "phone": "+1234567890"
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

## Booking API

### Create Booking
```
POST /api/bookings
Content-Type: application/json

Request:
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

Response (201):
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "_id": "...",
    "fullName": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "service": "Grocery Shopping",
    "date": "2026-06-25T00:00:00Z",
    "time": "14:00",
    "details": "Buy milk and eggs",
    "status": "pending",
    "paymentStatus": "pending",
    "amount": 50,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Get All Bookings (Admin)
```
GET /api/bookings?status=pending&email=john@example.com&page=1&limit=10
Authorization: Bearer {admin_token}

Response (200):
{
  "success": true,
  "total": 1,
  "pages": 1,
  "currentPage": 1,
  "bookings": [ ... ]
}
```

### Get Single Booking
```
GET /api/bookings/{id}

Response (200):
{
  "success": true,
  "booking": { ... }
}
```

### Update Booking (Admin)
```
PUT /api/bookings/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

Request:
{
  "status": "confirmed",
  "notes": "Confirmed and assigned"
}

Response (200):
{
  "success": true,
  "message": "Booking updated successfully",
  "booking": { ... }
}
```

### Delete Booking (Admin)
```
DELETE /api/bookings/{id}
Authorization: Bearer {admin_token}

Response (200):
{
  "success": true,
  "message": "Booking deleted successfully",
  "booking": { ... }
}
```

### Get Statistics (Admin)
```
GET /api/bookings/stats/all
Authorization: Bearer {admin_token}

Response (200):
{
  "success": true,
  "statistics": {
    "totalBookings": 150,
    "pendingBookings": 25,
    "completedBookings": 120,
    "revenue": 5000
  }
}
```

---

## Payment API

### Create Payment Intent
```
POST /api/payments/intent
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "bookingId": "booking-id",
  "amount": 50
}

Response (200):
{
  "success": true,
  "clientSecret": "pi_123456_secret_789",
  "paymentIntentId": "pi_123456"
}
```

### Confirm Payment
```
POST /api/payments/confirm
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "paymentIntentId": "pi_123456"
}

Response (200):
{
  "success": true,
  "payment": {
    "_id": "...",
    "bookingId": "...",
    "userId": "...",
    "amount": 50,
    "status": "succeeded",
    "stripePaymentId": "pi_123456"
  }
}
```

### Get Payment
```
GET /api/payments/{id}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "payment": { ... }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Booking not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Error creating booking",
  "error": "..."
}
```

---

## Rate Limiting

API has rate limiting:
- **100 requests per 15 minutes** per IP

Exceeding limit returns:
```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
Status: 429
```

---

## Status Codes

| Code | Meaning |
|------|----------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Server Error |
