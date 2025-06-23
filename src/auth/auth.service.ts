import db from "../drizzle/db";
import { sql } from "drizzle-orm";
import { CustomerTable } from "../drizzle/schema";
import { customer } from "../drizzle/schema";

export const createCustomerService = async (data: customer) => {
  await db.insert(CustomerTable).values(data);
  return "Customer created";
};

export const getCustomerByEmailService = async (email: string) => {
  return await db.query.CustomerTable.findFirst({
    where: sql`${CustomerTable.email} = ${email}`
  });
};

export const verifyCustomerService = async (email: string) => {
  await db.update(CustomerTable)
    .set({ isVerified: true, verificationCode: null })
    .where(sql`${CustomerTable.email} = ${email}`);
};

export const loginCustomerService = async (email: string) => {
  return await db.query.CustomerTable.findFirst({
    columns: {
      customerID: true,
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      role: true,
      isVerified: true
    },
    where: sql`${CustomerTable.email} = ${email}`
  });
};
