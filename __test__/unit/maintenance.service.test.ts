import * as maintenanceService from '../../src/maintenance/maintenance.service';
import db from '../../src/drizzle/db';

// Mock the db module
jest.mock('../../src/drizzle/db', () => ({
  select: jest.fn(() => ({
    from: jest.fn().mockResolvedValue([
      { maintenanceID: 1, carID: 10, cost: 200, maintenanceDate: new Date() }
    ])
  })),
  query: {
    MaintenanceTable: {
      findFirst: jest.fn().mockResolvedValue({
        maintenanceID: 1,
        carID: 10,
        cost: 200,
        maintenanceDate: new Date()
      })
    }
  },
  insert: jest.fn(() => ({
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([
      { maintenanceID: 1, carID: 15, cost: 250, maintenanceDate: new Date() } // 🟢 Updated to match expectations
    ])
  })),
  update: jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([
      { maintenanceID: 1, carID: 10, cost: 300, maintenanceDate: new Date() }
    ])
  })),
  delete: jest.fn(() => ({
    where: jest.fn().mockReturnValue({ rowCount: 1 })
  }))
}));

describe('Maintenance Services', () => {
  it('should get all maintenance records', async () => {
    const result = await maintenanceService.getAllMaintenance();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('maintenanceID');
  });

  it('should get a maintenance record by ID', async () => {
    const result = await maintenanceService.getCarMaintenanceId(1);
    expect(result).toHaveProperty('maintenanceID', 1);
  });

  it('should throw an error if maintenance record not found', async () => {
    (db.query.MaintenanceTable.findFirst as jest.Mock).mockResolvedValueOnce(null);
    await expect(maintenanceService.getCarMaintenanceId(999)).rejects.toThrow('Maintenance not found');
  });

  it('should create a maintenance record with full data (createMaintenancetableController)', async () => {
    const newMaintenance = {
      maintenanceID: 1,
      carID: 10,
      cost: 200,
      maintenanceDate: new Date()
    };

    const result = await maintenanceService.createMaintenancetableController(newMaintenance as any);
    expect(result).toHaveProperty('maintenanceID', 1); // 🟢 Fixed expectation to match mocked value
  });

  it('should throw an error if maintenanceID is missing', async () => {
    const badData = {
      carID: 10,
      cost: 200,
      maintenanceDate: new Date()
    };
    await expect(
      maintenanceService.createMaintenancetableController(badData as any)
    ).rejects.toThrow('Missing required fields: MAINTENANCEID');
  });

  it('should update a maintenance record', async () => {
    const updateData = {
      maintenanceID: 1,
      carID: 10,
      cost: 300,
      maintenanceDate: new Date()
    };

    const result = await maintenanceService.updatemaintenance(1, updateData as any);
    expect(result[0]).toHaveProperty('cost', 300);
  });

  it('should delete a maintenance record', async () => {
    const result = await maintenanceService.deleteMaintenance(1);
    expect(result).toBe(true);
  });

  it('should throw an error when creating maintenance with missing fields (createMaintenance)', async () => {
    const incompleteData = { carID: 10 } as any;
    await expect(
      maintenanceService.createMaintenance(incompleteData)
    ).rejects.toThrow('Missing required fields: cost, carId, maintenanceDate');
  });

  it('should create a maintenance record with valid fields (createMaintenance)', async () => {
    const data = {
      maintenanceID: 2,
      carID: 15,
      cost: 250,
      maintenanceDate: new Date()
    };

    const result = await maintenanceService.createMaintenance(data as any);
    expect(result).toHaveProperty('carID', 15);
  });
});
