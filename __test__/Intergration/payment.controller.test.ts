import request from 'supertest';
import { app } from '../../src/index'; 
import db from '../../src/drizzle/db';
import {
  CustomerTable,
  CarTable,
  LocationTable,
  BookingsTable,
  PaymentTable
} from '../../src/drizzle/schema';
import { eq } from 'drizzle-orm';

let customerID: number;
let carID: number;
let locationID: number;
let bookingID: number;
let paymentID: number;

beforeAll(async () => {
  
  const [location] = await db.insert(LocationTable).values({
    locationName: 'Test Location',
    address: '123 Location St',
    contactNumber: '9876543210'
  }).returning();
  locationID = location.locationID;

  const [car] = await db.insert(CarTable).values({
    carModel: 'Honda Civic',
    year: '2024-01-01',
    color: 'Silver',
    rentalRate: '70.00',
    availability: true,
    locationID
  }).returning();
  carID = car.carID;

  const [customer] = await db.insert(CustomerTable).values({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    password: 'securepassword',
    phoneNumber: '5555555555',
    address: '456 Test Ave'
  }).returning();
  customerID = customer.customerID;

  const [booking] = await db.insert(BookingsTable).values({
    carID: 1,
    customerID: customerID,
    rentalStartDate: new Date('2024-06-15'),
    rentalEndDate: new Date('2024-06-20'),
    totalAmount: '350.00'
  }).returning();
  bookingID = booking.bookingID;
});

afterAll(async () => {
  if (paymentID) {
    await db.delete(PaymentTable).where(eq(PaymentTable.paymentID, paymentID));
  }
  await db.delete(BookingsTable).where(eq(BookingsTable.bookingID, bookingID));
  await db.delete(CarTable).where(eq(CarTable.carID, carID));
  await db.delete(CustomerTable).where(eq(CustomerTable.customerID, customerID));
  await db.delete(LocationTable).where(eq(LocationTable.locationID, locationID));
  await db.$client.end();
});

describe('Payment API Integration Tests', () => {
  it('should create a new payment', async () => {
    const paymentData = {
      bookingID,
      paymentDate: '2024-06-10',
      amount: '350.00',
      paymentMethod: 'Credit Card'
    };

    const res = await request(app)
      .post('/api/payment')
      .send(paymentData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('paymentID');
    expect(res.body.amount).toBe('350.00');

    paymentID = res.body.paymentID;
  });

  it('should retrieve all payments', async () => {
    const res = await request(app).get('/api/payment');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a payment by ID', async () => {
    const res = await request(app).get(`/api/payment/${paymentID}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('paymentID', paymentID);
  });

  it('should update a payment', async () => {
    const res = await request(app)
      .put(`/api/payment/${paymentID}`)
      .send({ amount: '400.00' });

    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty('amount', '400.00');
  });

  it('should delete a payment', async () => {
    const res = await request(app).delete(`/api/payment/${paymentID}`);

    expect(res.statusCode).toBe(204);
    paymentID = 0; 
  });

  
  it('should return 400 for invalid payment ID', async () => {
    const res = await request(app).get('/api/payment/invalid-id');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid Payment ID');
  });

  it('should return 404 for non-existing payment', async () => {
    const res = await request(app).get('/api/payment/99999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Payment not found');
  });
});
