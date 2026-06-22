# QuickTask Runner - Backend Service

A Node.js/Express backend service for managing errand bookings for the QuickTask Runner platform.

## Features

- ✅ Create, read, update, and delete bookings
- ✅ Email notifications (customer confirmation & admin notification)
- ✅ RESTful API endpoints
- ✅ Admin dashboard for managing bookings
- ✅ File-based storage (JSON) for simplicity
- ✅ CORS support for frontend integration

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Gmail account (for email notifications)

## Installation

1. Clone the repository

```bash
git clone https://github.com/MyDailyErrands/quicktaskrunner.git
cd quicktaskrunner
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```
PORT=3000
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
ADMIN_EMAIL=admin@quicktaskrunner.com
NODE_ENV=development
```

**Note**: For Gmail, you'll need to generate an [App Password](https://support.google.com/accounts/answer/185833) instead of using your regular password.

4. Start the server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will run on `http://localhost:3000`

## API Endpoints

### Create Booking

**POST** `/api/bookings`

Request body:

```json
{
  "fullName": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "service": "Grocery Shopping",
  "date": "2026-06-25",
  "time": "14:00",
  "details": "Buy milk, eggs, and bread"
}
```

### Get All Bookings

**GET** `/api/bookings`

Returns all bookings (admin access recommended).

### Get Single Booking

**GET** `/api/bookings/:id`

Returns a specific booking by ID.

### Update Booking Status

**PUT** `/api/bookings/:id`

Request body:

```json
{
  "status": "confirmed"
}
```

Valid statuses: `pending`, `confirmed`, `completed`, `cancelled`

### Delete Booking

**DELETE** `/api/bookings/:id`

Deletes a booking.

### Health Check

**GET** `/api/health`

Returns server status.

## Admin Dashboard

Access the admin dashboard at `http://localhost:3000/admin.html`

Features:
- View all bookings
- Update booking status
- Delete bookings
- View booking statistics

## Project Structure

```
├── server.js           # Main Express server
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore file
├── public/
│   ├── app.js          # Frontend booking form script
│   ├── admin.html      # Admin dashboard
│   └── admin.js        # Admin dashboard script
└── data/
    └── bookings.json   # Stored bookings (auto-created)
```

## Frontend Integration

Include the `app.js` script in your HTML form page:

```html
<script src="/app.js"></script>
```

The script automatically handles form submission to the backend.

## Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication on your Google Account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Use the generated password in `.env` as `EMAIL_PASSWORD`

### Other Email Services

Update `EMAIL_SERVICE` in `.env` to your provider (e.g., `outlook`, `yahoo`). Refer to [Nodemailer documentation](https://nodemailer.com/smtp/well-known/) for supported services.

## Deployment

### Heroku

```bash
heroku create your-app-name
git push heroku main
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set ADMIN_EMAIL=admin@example.com
```

### Other Platforms

Set the same environment variables and ensure `PORT` is configured correctly.

## Database Migration

To upgrade from file-based storage to a database (MongoDB, PostgreSQL, etc.), replace the file I/O functions (`loadBookings`, `saveBookings`) with database queries.

## Security Considerations

- ⚠️ Add authentication/authorization for admin endpoints
- ⚠️ Validate and sanitize all user inputs
- ⚠️ Add rate limiting to prevent abuse
- ⚠️ Use HTTPS in production
- ⚠️ Never commit `.env` file to version control

## Troubleshooting

### Emails not sending

- Verify Gmail 2FA is enabled
- Check App Password is correctly set
- Ensure `EMAIL_USER` matches the Gmail account

### Port already in use

```bash
# Change PORT in .env or kill the process
lsof -i :3000  # Check what's using port 3000
```

### Data not persisting

Ensure the `data/` directory has write permissions.

## License

ISC

## Support

For issues or questions, please create an issue in the repository.
