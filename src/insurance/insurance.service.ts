import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {insurance, InsuranceTable } from "../drizzle/schema";


export const getAllInsurance = async () => {
  return await db.select().from(InsuranceTable);
};

export const getInsuranceById = async (id: number) => {
  const Insurance = await db.query.InsuranceTable.findFirst({
    where: eq(InsuranceTable.insuranceID, id)
  });
  if (!Insurance) throw new Error("Insurance not found");
  return Insurance;
};

export const createInsuranceTableController = async (data: insurance) => {
  if (!data.insuranceID) {
    throw new Error("Missing required fields: insurance");
  }
  return (await db.insert(InsuranceTable).values(data).returning())[0];
};


export const updateinsurance = async (id: number, data: insurance) => {
  return await db
    .update(InsuranceTable)
    .set(data)
    .where(eq(InsuranceTable.insuranceID, id))
    .returning();
};

export const deleteCar = async (id: number) => {
  const result = await db.delete(InsuranceTable).where(eq(InsuranceTable.carID, id));
  if (result.length === 0) throw new Error("insurance not found");
  return true;
};

export const createInsurance = async (data: insurance) => {
  if (!data.insuranceID) {
    throw new Error("Missing required fields: insurance");
  }

  const result = await db.insert(InsuranceTable).values(data).returning();
  return result[0];
  
};
export function deleteinsurance(id: number) {
  throw new Error('Function not implemented.');
}

