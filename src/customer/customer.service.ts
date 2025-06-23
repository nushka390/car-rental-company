import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { BookingsTable, customer, CustomerTable, PaymentTable } from "../drizzle/schema";


export const getAllcustomers = async () => {
  return await db.select().from(CustomerTable);
};

export const getcustomerById = async (id: number) => {
  const customer = await db
    .select()
    .from(CustomerTable)
    .leftJoin(BookingsTable as any, eq(BookingsTable.customerID, CustomerTable.customerID))
    .leftJoin(PaymentTable as any, eq(PaymentTable.bookingID, BookingsTable.bookingID))
    .where(eq(CustomerTable.customerID, id));

    console.log("Customer : " + customer);
  if (!customer) throw new Error("Customer not found");
  return customer;
};

export const createCustomerTableController = async (data: customer) => {
  if (!data.customerID )
  {
    throw new Error("Missing required fields: customer");
  }
  return (await db.insert(CustomerTable).values(data).returning())[0];
};

export const updateCustomer = async (id: number, data: customer) => {
  return await db
    .update(CustomerTable)
    .set(data)
    .where(eq(CustomerTable.customerID, id))
    .returning();
};


export const deletecustomer = async (id: number) => {
  const result = await db.delete(CustomerTable).where(eq(CustomerTable.customerID, id));
  if (result.length === 0) throw new Error("customer not found");
  return true;
};






export const Createcustomer = async (data: customer) => {
  if (!data.firstName || !data.lastName || !data.phoneNumber) {
    throw new Error("Missing required fields: FirtName, lastName, phoneNumber");
  }

  const result = await db.insert(CustomerTable).values(data).returning();
  return result[0];
  
};



