const request = require('supertest');
const app = require('../server');
const Booking = require('../models/Booking');

describe('Booking API', () => {
  beforeEach(async () => {
    await Booking.deleteMany({});
  });

  test('Should create a booking', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({
        fullName: 'John Doe',
        phone: '+1234567890',
        email: 'john@example.com',
        service: 'Grocery Shopping',
        date: '2026-06-25',
        time: '14:00',
        details: 'Buy milk and eggs',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.booking).toHaveProperty('_id');
  });

  test('Should get all bookings', async () => {
    await Booking.create({
      fullName: 'John Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      service: 'Grocery Shopping',
      date: new Date(),
      time: '14:00',
    });

    const res = await request(app).get('/api/bookings');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Should get booking by ID', async () => {
    const booking = await Booking.create({
      fullName: 'John Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      service: 'Grocery Shopping',
      date: new Date(),
      time: '14:00',
    });

    const res = await request(app).get(`/api/bookings/${booking._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.booking._id).toEqual(booking._id.toString());
  });
});
