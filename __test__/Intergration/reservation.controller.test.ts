// __test__/integration/reservation.controller.test.ts

import request from 'supertest';
  import {app} from '../../src/index';
import db from '../../src/drizzle/db';
import { ReservationTable, CustomerTable, CarTable, LocationTable, PaymentTable } from '../../src/drizzle/schema';
import { eq } from 'drizzle-orm';

let customerId: number;
let carId: number;
let reservationId: number;
let locationId: number;

beforeAll(async () => {
  const location = {
    locationID: 1,
    locationName: "Test Location",
    address: "123 Test St",
    contactNumber: "999999999"
  }
  locationId = location.locationID;

  const car = {
    carID: 1,
    carModel: "Honda Civic",
    year: '2022-01-01',
    color: "Red",
    rentalRate: "45.00",
    availability: true,
    locationID: locationId
  }
  carId = car.carID;

  const customer = {
    customerID: 32,
    firstName: "Test",
    lastName: "User",
    email: "tesuser@example.com",
    phoneNumber: "0712345678",
    address: "456 Avenue",
    password: "testpassword123"
  }
  customerId = customer.customerID;
});

afterAll(async () => {
  if (reservationId) {
    await db.delete(ReservationTable).where(eq(ReservationTable.reservationID, reservationId));
  }
  await db.delete(CarTable).where(eq(CarTable.carID, carId));
  await db.delete(CustomerTable).where(eq(CustomerTable.customerID, customerId));
  await db.delete(LocationTable).where(eq(LocationTable.locationID, locationId));
  await db.$client.end();
});

describe('Reservation API Integration Tests', () => {
  

  it('should create a reservation', async () => {
    const reservation = {
        reservationID: 1,
        customerID: customerId,
        carID: carId,
        reservationDate: "2025-05-16",
        pickupDate: "2025-05-17",
        returnDate: "2025-06-05",
      
      }

    const res = await request(app)
      .post('/api/Reservation')
      .send(reservation);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('`reservationID`');
    reservationId = res.body.reservationID;
  });

  it('should get all reservations', async () => {
    const res = await request(app).get('/api/Reservation');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(false);
  });

  it('should get reservation by id', async () => {
    expect(reservationId).toBeDefined();
    const res = await request(app).get(`/api/Reservation/${reservationId}`);
    expect(res.body).toHaveProperty('reservationID', reservationId);
  });

  it('should update a reservation', async () => {
    const res = await request(app)
      .put(`/api/Reservation/${reservationId}`)
      .send({ returnDate: new Date(Date.now() + 5 * 86400000) });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('reservationID', reservationId);
  });

  it('should delete a reservation', async () => {
    const res = await request(app).delete(`/api/Reservation/${reservationId}`);
    expect(res.statusCode).toBe(400);
    reservationId = 0; // Skip deletion in afterAll
  });
});
