import * as locationService from '../../src/location table/location.service';
import db from '../../src/drizzle/db';

jest.mock('../../src/drizzle/db', () => ({
  select: jest.fn(() => ({
    from: jest.fn().mockResolvedValue([
      { locationID: 1, locationName: 'Nairobi' }
    ])
  })),
  query: {
    LocationTable: {
      findFirst: jest.fn().mockResolvedValue({
        locationID: 1,
        locationName: 'Nairobi'
      })
    }
  },
  insert: jest.fn(() => ({
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([
      { locationID: 1, locationName: 'Nairobi' }
    ])
  })),
  update: jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([
      { locationID: 1, locationName: 'Nairobi Updated' }
    ])
  })),
  delete: jest.fn(() => ({
    where: jest.fn().mockReturnValue({ rowCount: 1 })
  }))
}));

describe('📍 Location Services', () => {
  it('should fetch all locations', async () => {
    const result = await locationService.getAlllocation();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('locationName');
  });

  it('should fetch a location by ID', async () => {
    const result = await locationService.getlocationById(1);
    expect(result).toHaveProperty('locationID', 1);
  });

  it('should throw an error if location not found', async () => {
    (db.query.LocationTable.findFirst as jest.Mock).mockResolvedValueOnce(null);
    await expect(locationService.getlocationById(999)).rejects.toThrow('location not found');
  });

  it('should create a new location', async () => {
    const newLocation = {
      locationID: 2,
      locationName: 'Mombasa'
    };
    const result = await locationService.createLocationtableController(newLocation as any);
    expect(result).toHaveProperty('locationName', 'Nairobi');
  });

  it('should throw error if location name is missing', async () => {
    const badData = {
      locationID: 3
    };
    await expect(
      locationService.createLocationtableController(badData as any)
    ).rejects.toThrow('Missing required fields: LOCATION');
  });

  it('should update a location', async () => {
    const updateData = {
      locationID: 1,
      locationName: 'Nairobi Updated'
    };
    const result = await locationService.updateinsurance(1, updateData as any);
    expect(result[0]).toHaveProperty('locationName', 'Nairobi Updated');
  });

  it('should delete a location', async () => {
    const result = await locationService.deleteLocation(1);
    expect(result).toBe(true);
  });
});
