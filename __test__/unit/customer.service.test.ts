import * as customerService from '../../src/customer/customer.service';
import db from '../../src/drizzle/db';

// Mock the db module with safe, isolated chains
jest.mock('../../src/drizzle/db', () => ({
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

describe('Customer Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all customer records', async () => {
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockResolvedValueOnce([
        { customerID: 1, firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890' },
      ]),
    });

    const result = await customerService.getAllcustomers();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('customerID');
  });

  it('should get a customer record by ID', async () => {
    const mockWhere = jest.fn().mockResolvedValueOnce([
      {
        customerID: 1,
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        BookingsTable: null,
        PaymentTable: null,
      },
    ]);

    const mockLeftJoin = {
      leftJoin: jest.fn().mockReturnValue({
        leftJoin: jest.fn().mockReturnValue({
          where: mockWhere,
        }),
      }),
    };

    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue(mockLeftJoin),
    });

    const result = await customerService.getcustomerById(1);
    expect(result[0]).toHaveProperty('customerID', 1);
  });

  it('should throw an error if customer not found', async () => {
    const mockWhere = jest.fn().mockResolvedValueOnce(null);

    const mockLeftJoin = {
      leftJoin: jest.fn().mockReturnValue({
        leftJoin: jest.fn().mockReturnValue({
          where: mockWhere,
        }),
      }),
    };

    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue(mockLeftJoin),
    });

    await expect(customerService.getcustomerById(999)).rejects.toThrow('Customer not found');
  });

  it('should create a customer with full data', async () => {
    const newCustomer = {
      customerID: 1,
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
    };

    (db.insert as jest.Mock).mockReturnValueOnce({
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValueOnce([newCustomer]),
    });

    const result = await customerService.createCustomerTableController(newCustomer as any);
    expect(result).toHaveProperty('customerID', 1);
  });

  it('should throw error if required fields are missing (Createcustomer)', async () => {
    const badData = {
      firstName: 'Jane',
      phoneNumber: '0987654321',
    };

    await expect(
      customerService.Createcustomer(badData as any)
    ).rejects.toThrow('Missing required fields: FirtName, lastName, phoneNumber');
  });

  it('should update a customer record', async () => {
    const updated = {
      customerID: 1,
      firstName: 'Jane',
      lastName: 'Doe',
      phoneNumber: '1234567890',
    };

    (db.update as jest.Mock).mockReturnValueOnce({
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValueOnce([{ customerID: 1, firstName: 'Jane' }]),
    });

    const result = await customerService.updateCustomer(1, updated as any);
    expect(result[0]).toHaveProperty('firstName', 'Jane');
  });

  it('should delete a customer record', async () => {
    (db.delete as jest.Mock).mockReturnValueOnce({
      where: jest.fn().mockReturnValue({ rowCount: 1 }),
    });

    const result = await customerService.deletecustomer(1);
    expect(result).toBe(true);
  });
});
