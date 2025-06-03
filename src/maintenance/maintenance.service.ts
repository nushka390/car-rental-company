import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { Maintenance, MaintenanceTable } from "../drizzle/schema";


export const getAllMaintenance = async () => {
  return await db.select().from(MaintenanceTable);
};

export const getCarMaintenanceId = async (id: number) => {
  const maintenance = await db.query.MaintenanceTable.findFirst({
    where: eq(MaintenanceTable.maintenanceID, id)
  });
  if (!maintenance) throw new Error("Maintenance not found");
  return maintenance;
};

export const createMaintenancetableController = async (data: Maintenance) => {
  if (!data.maintenanceID) {
    throw new Error("Missing required fields: MAINTENANCEID");
  }
  return (await db.insert(MaintenanceTable).values(data).returning())[0];
};
export const updatemaintenance = async (id: number, data: Maintenance) => {
  return await db
    .update(MaintenanceTable)
    .set(data)
    .where(eq(MaintenanceTable.maintenanceID, id))
    .returning();
};



export const deleteMaintenance = async (id: number) => {
  const result = await db.delete(MaintenanceTable).where(eq(MaintenanceTable.maintenanceID, id));
  if (result.rowCount === 0) throw new Error("Maintenance not found");
  return true;
};

export function createCar(arg0: any) {
  throw new Error('Function not implemented.');
}
