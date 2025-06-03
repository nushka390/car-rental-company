import { Request, Response } from 'express';
import * as carService from './car.service';

export const getAllCarscontroller = async (req: Request, res: Response) => {
  try {
    const cars = await carService.getAllCars();
    res.json(cars);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCarByIdcontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid car ID" });
      return;
    }
    
    const car = await carService.getCarById(id);
    res.json(car);
    return;
  } catch (error: any) {
    if (error.message === "Car not found") {
      res.status(404).json({ error: error.message });
      return;
    } else {
      res.status(500).json({ error: error.message });
      return;
    }
  }
};

export const createcarController = async (req: Request, res: Response) => {
  try {
    if (!req.body.rentalRate || isNaN(req.body.rentalRate)) {
      res.status(400).json({ error: "Valid rentalRate is required" });
      return;
    }
    
    const newCar = await carService.createCar({
      ...req.body,
      rentalRate: parseFloat(req.body.rentalRate)
    });
    res.status(201).json(newCar);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updatecarcontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)){
     res.status(400).json({ error: "Invalid car ID" });
     return;
    }
  
    
    
    const updatedCar = await carService.updateCar(id, req.body);
    res.json(updatedCar);
    
  } catch (error: any) {
    if (error.message === "Car not found") {
      res.status(404).json({ error: error.message });
      
    } else {
      res.status(400).json({ error: error.message });
      return;
    }
  }
};

export const deleteCarcontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id))  {
      res.status(400).json({ error: "Invalid car ID" });
      return;
    }
  
    
    await carService.deleteCar(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "Car not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};