import * as paymentService from '../../src/payment table/payment.service';
import db from '../../src/drizzle/db';

// Mock the db module
jest.mock('../../src/drizzle/db', () => ({
  select: jest.fn(() => ({
    from: jest.fn().mockResolvedValue([
      { paymentID: 1, amount: 100, method: 'card', date: new Date() }
    ])
  })),
  query: {
    PaymentTable: {
      findFirst: jest.fn().mockResolvedValue({
        paymentID: 1,
        amount: 100,
        method: 'card',
        date: new Date()
      })
    }
  },
  insert: jest.fn(() => ({
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([
      { paymentID: 1, amount: 100, method: 'card', date: new Date() }
    ])
  })),
  update: jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([
      { paymentID: 1, amount: 150 }
    ])
  })),
  delete: jest.fn(() => ({
    where: jest.fn().mockReturnValue({ rowCount: 1 })
  }))
}));

describe('Payment Services', () => {
  it('should get all payment records', async () => {
    const result = await paymentService.getAllPayment();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('paymentID');
  });

  it('should get a payment record by ID', async () => {
    const result = await paymentService.getPaymentById(1);
    expect(result).toHaveProperty('paymentID', 1);
  });

  it('should throw an error if payment not found', async () => {
    (db.query.PaymentTable.findFirst as jest.Mock).mockResolvedValueOnce(null);
    await expect(paymentService.getPaymentById(999)).rejects.toThrow('Payment not found');
  });

  it('should create a payment with full data', async () => {
    const newPayment = {
      PaymentID: 1,
      amount: 100,
      method: 'card',
      date: new Date()
    };

    const result = await paymentService.createPaymentTableService(newPayment as any);
    expect(result).toHaveProperty('paymentID', 1);
  });

  it('should throw error if PaymentID is missing', async () => {
    const badData = {
      amount: 100,
      method: 'cash',
      date: new Date()
    };

    await expect(
      paymentService.createPaymentTableService(badData as any)
    ).rejects.toThrow('Missing required fields: Payment');
  });

  it('should update a payment record', async () => {
    const updateData = {
      paymentID: 1,
      amount: 150,
      method: 'card',
      date: new Date()
    };

    const result = await paymentService.updatePayment(1, updateData as any);
    expect(result[0]).toHaveProperty('amount', 150);
  });

  it('should delete a payment record', async () => {
    const result = await paymentService.deletePayment(1);
    expect(result).toBe(true);
  });
});
