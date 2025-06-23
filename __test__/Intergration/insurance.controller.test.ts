import request from 'supertest';
import {app} from '../../src/index';
import db from '../../src/drizzle/db';
import {
  CustomerTable,
  CarTable,
  LocationTable,
  InsuranceTable
} from '../../src/drizzle/schema';
import { eq } from 'drizzle-orm';

let locationId: number;
let carId: number;
let insuranceId: number;

const testLocation = {
  locationName: "Integration Test Location",
  address: "123 Integration St",
  contactNumber: "0700000000"
};

const testCar = {
  carModel: "Test Car",
  year: "2023-01-01",
  color: "Black",
  rentalRate: "100.00",
  availability: true
};

const testInsurance = {
  insuranceProvider: "Test Insurance Co.",
  policyNumber: "ABC123XYZ",
  startDate: "2024-07-01",
  endDate: "2025-07-01"
};

beforeAll(async () => {
  // Insert Location
  const [location] = await db.insert(LocationTable).values(testLocation).returning();
  locationId = location.locationID;

  // Insert Car
  const [car] = await db.insert(CarTable).values({
    ...testCar,
    locationID: locationId
  }).returning();
  carId = car.carID;
});

afterAll(async () => {
  if (insuranceId) {
    await db.delete(InsuranceTable).where(eq(InsuranceTable.insuranceID, insuranceId));
  }
  await db.delete(CarTable).where(eq(CarTable.carID, carId));
  await db.delete(LocationTable).where(eq(LocationTable.locationID, locationId));
  await db.$client.end();
});

describe('Insurance API Integration Tests', () => {
  it('should create insurance', async () => {
    const res = await request(app)
      .post('/api/insurance')
      .set('Authorization', 'Bearer admin-token') // Replace with real or mocked token
      .send({
        ...testInsurance,
        carID: carId
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('insuranceID');
    expect(res.body.carID).toBe(carId);

    insuranceId = res.body.insuranceID;
  });

  it('should retrieve all insurance records', async () => {
    const res = await request(app)
      .get('/api/insurance')
      .set('Authorization', 'Bearer admin-token');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should retrieve insurance by ID', async () => {
    const res = await request(app)
      .get(`/api/insurance/${insuranceId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.insuranceID).toBe(insuranceId);
  });

  it('should update insurance', async () => {
    const res = await request(app)
      .put(`/api/insurance/${insuranceId}`)
      .send({ policyNumber: 'UPDATED123' });

    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty('policyNumber', 'UPDATED123');
  });

  it('should delete insurance', async () => {
    const res = await request(app)
      .delete(`/api/insurance/${insuranceId}`);

    expect(res.statusCode).toBe(204);
    insuranceId = 0; // Prevent afterAll double-deletion
  });

  // Negative case
  it('should return 400 on invalid ID', async () => {
    const res = await request(app)
      .get('/api/insurance/invalid-id');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid insurance ID');
  });

  it('should return 404 on non-existent ID', async () => {
    const res = await request(app)
      .get('/api/insurance/99999');

    expect(res.statusCode).toBe(404);
    expect(res.body.error.toLowerCase()).toContain('not found');
  });
});
