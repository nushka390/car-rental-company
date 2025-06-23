import db from "../db"; // connects to your Drizzle DB
import { eq } from "drizzle-orm";
import { CustomerTable, BookingsTable, PaymentTable } from "../schema";

export const getCustomerDetails = async (customerId: number) => {
  const results = await db
    .select()
    .from(CustomerTable)
    .leftJoin(BookingsTable as any, eq(BookingsTable.customerID, CustomerTable.customerID))
    .leftJoin(PaymentTable as any, eq(PaymentTable.bookingID, BookingsTable.bookingID))
    .where(eq(CustomerTable.customerID, customerId));

  return results;
};
