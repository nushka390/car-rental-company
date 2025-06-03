import db from "../drizzle/db"; // your configured Drizzle instance
import { eq } from "drizzle-orm";
import { BookingsTable } from "../drizzle/schema";

// Create a new booking
export const createBookingService = async (bookingData: typeof BookingsTable.$inferInsert) => {
  try {
    const result = await db.insert(BookingsTable).values(bookingData).returning();
    return result[0]; // return the newly created booking
  } catch (error) {
    throw new Error(`Failed to create booking: ${error}`);
  }
};

// Get all bookings
export const getAllBookingsService = async () => {
  try {
    return await db.select().from(BookingsTable);
  } catch (error) {
    throw new Error(`Failed to fetch bookings: ${error}`);
  }
};

// Get booking by ID
export const getBookingByIdService = async (id: number) => {
  try {
    const result = await db.select().from(BookingsTable).where(eq(BookingsTable.bookingID, id));
    return result[0]; // return the booking or undefined
  } catch (error) {
    throw new Error(`Failed to fetch booking by ID: ${error}`);
  }
};

// Update booking
export const updateBookingService = async (id: number, updatedData: Partial<typeof BookingsTable.$inferInsert>) => {
  try {
    const result = await db
      .update(BookingsTable)
      .set(updatedData)
      .where(eq(BookingsTable.bookingID, id))
      .returning();
    return result[0]; // return the updated booking
  } catch (error) {
    throw new Error(`Failed to update booking: ${error}`);
  }
};

// Delete booking
export const deleteBookingService = async (id: number) => {
  try {
    const result = await db.delete(BookingsTable).where(eq(BookingsTable.bookingID, id)).returning();
    return result[0]; // return deleted booking (if needed)
  } catch (error) {
    throw new Error(`Failed to delete booking: ${error}`);
  }
};


