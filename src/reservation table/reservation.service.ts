import db from "../drizzle/db"; // your configured Drizzle instance
import { eq } from "drizzle-orm";
import { BookingsTable, ReservationTable } from "../drizzle/schema";

// Create a new booking
export const createReservationService = async (ReservationData: typeof ReservationTable.$inferInsert) => {
  try {
    const result = await db.insert(ReservationTable).values(ReservationData).returning();
    return result[0]; // return the newly created booking
  } catch (error) {
    throw new Error(`Failed to create booking: ${error}`);
  }
};

// Get all bookings
export const getAllBookingsService = async () => {
  try {
    return await db.select().from(ReservationTable);
  } catch (error) {
    throw new Error(`Failed to fetch Reservation: ${error}`);
  }
};

// Get booking by ID
export const getReservationByIdService = async (id: number) => {
  try {
    const result = await db.select().from(ReservationTable).where(eq(ReservationTable.reservationID, id));
    return result[0]; // return the booking or undefined
  } catch (error) {
    throw new Error(`Failed to fetch Reservation by ID: ${error}`);
  }
};

// Update booking
export const updateReservationService = async (id: number, updatedData: Partial<typeof ReservationTable.$inferInsert>) => {
  try {
    const result = await db
      .update(ReservationTable)
      .set(updatedData)
      .where(eq(ReservationTable.reservationID, id))
      .returning();
    return result[0]; // return the updated booking
  } catch (error) {
    throw new Error(`Failed to update Reservation: ${error}`);
  }
};

// Delete booking
export const deleteReservationService = async (id: number) => {
  try {
    const result = await db.delete(ReservationTable).where(eq(ReservationTable.reservationID, id)).returning();
    return result[0]; // return deleted booking (if needed)
  } catch (error) {
    throw new Error(`Failed to delete Reservation: ${error}`);
  }
};


export function getAllreservation(id: number) {
    throw new Error('Function not implemented.');
}

export function CreateReservation(arg0: any, body: any) {
    throw new Error('Function not implemented.');
}

export function deletereservation(id: number) {
    throw new Error('Function not implemented.');
}

export function newReservation(arg0: any) {
    throw new Error('Function not implemented.');
}

