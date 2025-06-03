import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {Car, Location, LocationTable } from "../drizzle/schema";


export const getAlllocation = async () => {
  return await db.select().from(LocationTable);
};

export const getlocationById = async (id: number) => {
  const location = await db.query.LocationTable.findFirst({
    where: eq(LocationTable.locationID, id)
  });
  if (!location) throw new Error("location not found");
  return location;
};

export const createLocationtableController = async (data: Location) => {
  if (!data.locationName ) {
    throw new Error("Missing required fields: LOCATION");
  }
  return (await db.insert(LocationTable).values(data).returning())[0];
};
export const updateinsurance = async (id: number, data: Location) => {
  return await db
    .update(LocationTable)
    .set(data)
    .where(eq(LocationTable.locationID, id))
    .returning();
};



export const deleteLocation = async (id: number) => {
  const result = await db.delete(LocationTable).where(eq(LocationTable.locationID, id));
  if (result.rowCount === 0) throw new Error("location not found");
  return true;
};

export function createLocation(arg0: any) {
  throw new Error('Function not implemented.');
}
export function updateilocation(id: number, body: any) {
    throw new Error('Function not implemented.');
}

