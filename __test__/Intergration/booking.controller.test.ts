import request from 'supertest';
import {app} from '../../src/index';
import db from '../../src/drizzle/db';
import { BookingsTable, CustomerTable, CarTable, LocationTable } from '../../src/drizzle/schema';
import { eq } from 'drizzle-orm';

// Test data





const testData = {
  customer: {
    firstName: "Test",
    lastName: "User",
    email: "test.user@example.com",
    phoneNumber: "1234567890",
    address: "123 Test St",
    password: "TestPassword123!"
  },
  location: {
    locationName: "Test Location",
    address: "456 Location Ave",
    contactNumber: "0987654321"
  },
  car: {
    carModel: "Test Model",
    year: '2023-01-01',
    color: "Red",
    rentalRate: "50.00",
    availability: true
  },
  booking: {
    rentalStartDate: '2024-01-01',
    rentalEndDate: '2024-01-05',
    totalAmount: "250.00"
  }
};

describe('Booking API Integration Tests', () => {
  let customerId: number;
  let carId: number;
  let locationId: number;
  let bookingId: number;

  beforeAll(async () => {
    // Setup test data
    const [location] = await db.insert(LocationTable).values(testData.location).returning();
    locationId = location.locationID;

    const [car] = await db.insert(CarTable).values({
      ...testData.car,
      locationID: locationId
    }).returning();
    carId = car.carID;

    const [customer] = await db.insert(CustomerTable).values(testData.customer).returning();
    customerId = customer.customerID;
  });

  afterAll(async () => {
    // Cleanup test data
    if (bookingId) {
      await db.delete(BookingsTable).where(eq(BookingsTable.bookingID, bookingId));
    }
    await db.delete(CarTable).where(eq(CarTable.carID, carId));
    await db.delete(CustomerTable).where(eq(CustomerTable.customerID, customerId));
    await db.delete(LocationTable).where(eq(LocationTable.locationID, locationId));
    await db.$client.end();
  });

  it('should create, retrieve, update, and delete a booking', async () => {
    // Create booking
    const createRes = await request(app)
      .post('/bookings')
      .send({
        ...testData.booking,
        customerID: customerId,
        carID: carId
      });
    
    expect(createRes.status).toBe(201);
    expect(createRes.body.booking).toHaveProperty('bookingID');
    bookingId = createRes.body.booking.bookingID;

    // Get all bookings
    const getAllRes = await request(app).get('/bookings');
    expect(getAllRes.status).toBe(200);
    expect(getAllRes.body.data).toBeInstanceOf(Array);
    expect(getAllRes.body.data.length).toBeGreaterThan(0);

    // Get booking by ID
    const getByIdRes = await request(app).get(`/bookings/${bookingId}`);
    expect(getByIdRes.status).toBe(200);
    expect(getByIdRes.body.data).toHaveProperty('bookingID', bookingId);

    // Update booking
    const updateRes = await request(app)
      .put(`/bookings/${bookingId}`)
      .send({ totalAmount: "300.00" });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.message).toBe("Booking updated successfully");

    // Delete booking
    const deleteRes = await request(app).delete(`/bookings/${bookingId}`);
    expect(deleteRes.status).toBe(204);
    bookingId = 0; // Prevent cleanup error
  });

  it('should fail to create booking with invalid data', async () => {
    // Missing required fields
    const res1 = await request(app)
      .post('/bookings')
      .send({ rentalStartDate: '2024-01-01' });
    expect(res1.status).toBe(400);

    // Invalid customer ID
    const res2 = await request(app)
      .post('/bookings')
      .send({
        ...testData.booking,
        customerID: 99999,
        carID: carId
      });
    expect(res2.status).toBeGreaterThanOrEqual(400);
  });
});