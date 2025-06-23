import request from 'supertest';
    import {app} from '../../src/index';
import db from '../../src/drizzle/db';
import { LocationTable } from '../../src/drizzle/schema';
import { eq } from 'drizzle-orm';

let locationId: number;

const testLocation = {
  locationName: "Test HQ",
  address: "123 Test Street",
  contactNumber: "0700000000"
};

beforeEach(async () => {
  // Clean the location table
  await db.delete(LocationTable);
});

afterAll(async () => {
  await db.delete(LocationTable);
  await db.$client.end();
});

describe("Location API Integration Tests", () => {

  it("should create a location", async () => {
    const res = await request(app)
      .post('/api/location')
      .send(testLocation);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('locationID');
    expect(res.body.locationName).toBe('Test HQ');

    locationId = res.body.locationID;
  });

  it("should get all locations", async () => {
    // Insert one manually first
    await db.insert(LocationTable).values(testLocation);

    const res = await request(app).get('/api/location');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should get a location by ID", async () => {
    const [location] = await db.insert(LocationTable).values(testLocation).returning();
    locationId = location.locationID;

    const res = await request(app).get(`/api/location/${locationId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('locationID', locationId);
    expect(res.body.locationName).toBe('Test HQ');
  });

  it("should update a location", async () => {
    const [location] = await db.insert(LocationTable).values(testLocation).returning();
    locationId = location.locationID;

    const updatedData = { locationName: 'Updated HQ' };

    const res = await request(app)
      .put(`/api/location/${locationId}`)
      .send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty('locationName', 'Updated HQ');
  });

  it("should delete a location", async () => {
    const [location] = await db.insert(LocationTable).values(testLocation).returning();
    locationId = location.locationID;
    console.log("deleted Location ID:", locationId);


    const res = await request(app)
      .delete(`/api/location/${locationId}`);

    expect(res.statusCode).toBe(204);

    // Confirm deletion
    // const check = await db.query.LocationTable.findFirst({
    //   where: eq(LocationTable.locationID, locationId)
    // });
    // expect(check).toBeUndefined();
  });

  // ❌ NEGATIVE TESTS

  it("should return 400 for invalid ID on GET", async () => {
    const res = await request(app).get('/api/location/invalid');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid Location ID');
  });

  it("should return 404 if location not found", async () => {
    const res = await request(app).get('/api/location/99999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error.toLowerCase()).toContain("not found");
  });
});
