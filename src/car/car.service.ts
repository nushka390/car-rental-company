import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { Car, CarTable } from "../drizzle/schema";


export const getAllCars = async () => {
  return await db.select().from(CarTable);
};

export const getCarById = async (id: number) => {
  const car = await db.query.CarTable.findFirst({
    where: eq(CarTable.carID, id)
  });
  if (!car) throw new Error("Car not found");
  return car;
};

export const createcartableController = async (data: Car) => {
  if (!data.carModel || !data.year || !data.rentalRate) {
    throw new Error("Missing required fields: carModel, year, rentalRate");
  }
  return (await db.insert(CarTable).values(data).returning())[0];
};

export const updateCar = async (id: number, data: Partial<Car>) => {
  if (Object.keys(data).length === 0) {
    throw new Error("No update data provided");
  }
  const result = await db
    .update(CarTable)
    .set(data)
    .where(eq(CarTable.carID, id))
    .returning();
    
  if (!result[0]) throw new Error("Car not found");
  return result[0];
};

export const deleteCar = async (id: number) => {
  const result = await db.delete(CarTable).where(eq(CarTable.carID, id));
  if (result.length === 0) throw new Error("Car not found");
  return true;
};

export const createCar = async (data: Car) => {
  if (!data.carModel || !data.year || !data.rentalRate) {
    throw new Error("Missing required fields: carModel, year, rentalRate");
  }

  const result = await db.insert(CarTable).values(data).returning();
  return result[0];
  
};

