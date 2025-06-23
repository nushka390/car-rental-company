import * as bookingService from '../../src/booking table/booking.service';
import db from '../../src/drizzle/db';

jest.mock('../../src/drizzle/db', () => ({
  select: jest.fn(() => ({
    from: jest.fn().mockResolvedValue([
      { bookingID: 1, customerID: 2, carID: 3, date: new Date() }
    ]),
    where: jest.fn().mockResolvedValue([
      { bookingID: 1, customerID: 2, carID: 3, date: new Date() }
    ])
  })),
  insert: jest.fn(() => ({
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([
      { bookingID: 1, customerID: 2, carID: 3, date: new Date() }
    ])
  })),
  update: jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([
      { bookingID: 1, customerID: 2, carID: 3, date: new Date() }
    ])
  })),
  delete: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([
      { bookingID: 1, customerID: 2, carID: 3, date: new Date() }
    ])
  }))
}));

describe(' Booking Service Tests', () => {
  it('should create a new booking', async () => {
    const newBooking = {
      bookingID: 1,
      customerID: 2,
      carID: 3,
      date: new Date()
    };
    const result = await bookingService.createBookingService(newBooking as any);
    expect(result).toHaveProperty('bookingID', 1);
  });

  it('should get all bookings', async () => {
    const result = await bookingService.getAllBookingsService();
        expect(result.length).toBeGreaterThan(0);
      });
    });
