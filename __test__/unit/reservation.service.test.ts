import * as reservationService from '../../src/reservation table/reservation.service';
import db from '../../src/drizzle/db';
import { ReservationTable } from '../../src/drizzle/schema';
import { eq } from "drizzle-orm";

// Mock the db module
jest.mock('../../src/drizzle/db', () => {
  const mockSelect = {
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockResolvedValue([{ reservationID: 1 }])
  };

  return {
    insert: jest.fn(() => ({
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([{ reservationID: 1 }])
    })),
    select: jest.fn(() => mockSelect),
    update: jest.fn(() => ({
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([{ reservationID: 1 }])
    })),
    delete: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([{ reservationID: 1 }])
    })),
    query: {
      ReservationTable: {
        findMany: jest.fn().mockResolvedValue([
          {
            reservationID: 1,
            customerID: 10,
            carID: 20,
            reservationDate: new Date(),
            pickupDate: new Date(),
            returnDate: new Date()
          }
        ])
      }
    }
  };
});

describe('Reservation Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a reservation', async () => {
    const newReservation = {
      customerID: 10,
      carID: 20,
      reservationDate: new Date(),
      pickupDate: new Date(),
      returnDate: new Date()
    };

    const result = await reservationService.createReservationService(newReservation as any);
    expect(result).toHaveProperty('reservationID', 1);
  });

  it('should get all reservations', async () => {
    // Mock the select().from() chain to return an array
    (db.select().from as jest.Mock).mockResolvedValueOnce([
      { reservationID: 1 },
      { reservationID: 2 }
    ]);

    const result = await reservationService.getAllBookingsService();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('reservationID');
  });

  it('should get a reservation by ID', async () => {
    const result = await reservationService.getReservationByIdService(1);
    expect(result).toHaveProperty('reservationID', 1);
  });

  it('should update a reservation', async () => {
    const updateData = { carID: 999 };
    const result = await reservationService.updateReservationService(1, updateData);
    expect(result).toHaveProperty('reservationID', 1);
  });

  it('should delete a reservation', async () => {
    const result = await reservationService.deleteReservationService(1);
    expect(result).toHaveProperty('reservationID', 1);
  });
});