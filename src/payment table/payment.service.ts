import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {  PaymentTable } from "../drizzle/schema";


export const getAllPayment = async () => {
  return await db.select().from(PaymentTable);
};

export const getPaymentById = async (id: number) => {
  const Payment = await db.query.PaymentTable.findFirst({
    where: eq(PaymentTable.paymentID, id)
  });
  if (!Payment) throw new Error("Payment not found");
  return Payment;
};

export const createPaymentTableController = async (data: any) => {
  if (!data.PaymentID )
     {
    throw new Error("Missing required fields: Payment");
  }
  return (await db.insert(PaymentTable).values(data).returning())[0];
};

export const updatePayment = async (id: number, data: any) => {
  return await db
    .update(PaymentTable)
    .set(data)
    .where(eq(PaymentTable.paymentID, id))
    .returning();
};


export const deletePayment = async (id: number) => {
  const result = await db.delete(PaymentTable).where(eq(PaymentTable.paymentID, id));
  if (result.rowCount === 0) throw new Error("Payment not found");
  return true;
};






export function CreatePayment(arg0: any) {
  throw new Error('Function not implemented.');
}

