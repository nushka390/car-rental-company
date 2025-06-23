import * as carService from '../../src/car/car.service';
import db from '../../src/drizzle/db';

// Mock the db module
jest.mock('../../src/drizzle/db', () => ({
  select: jest.fn(() => ({
    from: jest.fn().mockResolvedValue([
      { carID: 1, carModel: 'Toyota', year: 2020, rentalRate: 55 }
    ])
  })),
  query: {
    CarTable: {
      findFirst: jest.fn().mockResolvedValue({
        carID: 1,
        carModel: 'Toyota',
        year: 2020,
        rentalRate: 55
      })
    }
  },
  insert: jest.fn(() => ({
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([
      { carID: 1, carModel: 'Toyota', year: 2020, rentalRate: 55 }
    ])
  })),
  update: jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([
      { carID: 1, carModel: 'Toyota', year: 2021, rentalRate: 60 }
    ])
  })),
  delete: jest.fn(() => ({
    where: jest.fn().mockReturnValue({ rowCount: 1 })
  }))
}));

describe('🚗 Car Service Tests', () => {
  it('should fetch all cars', async () => {
    const result = await carService.getAllCars();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('carModel');
  });

  it('should get car by ID', async () => {
    const result = await carService.getCarById(1);
    expect(result).toHaveProperty('carID', 1);
  });

  it('should throw error if car not found', async () => {
    (db.query.CarTable.findFirst as jest.Mock).mockResolvedValueOnce(null);
    await expect(carService.getCarById(999)).rejects.toThrow('Car not found');
  });

  it('should create a new car with valid data', async () => {
    const newCar = {
      carID: 1,
      carModel: 'Toyota',
      year: 2020,
      rentalRate: 55
    };

    const result = await carService.createcartableController(newCar as any);
    expect(result).toHaveProperty('carModel', 'Toyota');
  });

  it('should throw error if required car fields are missing', async () => {
    const invalidData = {
      carID: 2,
      year: 2020
    };

    await expect(
      carService.createcartableController(invalidData as any)
    ).rejects.toThrow('Missing required fields: carModel, year, rentalRate');
  });

  it('should update a car record', async () => {
    const updatedCar = {
      carModel: 'Toyota',
      year: '2021',
      rentalRate: '60'
    };

    const result = await carService.updateCar(1, updatedCar);
    expect(result).toHaveProperty('year', 2021);
  });

  it('should throw error if no update data provided', async () => {
    await expect(carService.updateCar(1, {})).rejects.toThrow('No update data provided');
  });

  it('should delete a car', async () => {
    const result = await carService.deleteCar(1);
    expect(result).toBe(true);
  });
});
