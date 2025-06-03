import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { customer, CustomerTable } from "../drizzle/schema";


export const getAllcustomers = async () => {
  return await db.select().from(CustomerTable);
};

export const getcustomerById = async (id: number) => {
  const customer = await db.query.CustomerTable.findFirst({
    where: eq(CustomerTable.customerID, id)
  });
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
  if (result.rowCount === 0) throw new Error("customer not found");
  return true;
};






export function Createcustomer(arg0: any) {
  throw new Error('Function not implemented.');
}

