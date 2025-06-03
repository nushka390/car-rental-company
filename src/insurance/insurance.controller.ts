import { Request, Response } from 'express';
import * as insuranceService from './insurance.service';

export const getAllinsurancecontroller = async (req: Request, res: Response) => {
  try {
    const insurance = await insuranceService.getAllInsurance();
    res.json(insurance);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getInsuranceByIdcontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid insurance ID" });
      return;
    }
    
    const insurance = await insuranceService.getInsuranceById(id);
    res.json(insurance);
    return;
  } catch (error: any) {
    if (error.message === "insurance not found") {
      res.status(404).json({ error: error.message });
      return;
    } else {
      res.status(500).json({ error: error.message });
      return;
    }
  }
};

export const createinsuranceController = async (req: Request, res: Response) => {
  try {
    if (!req.body.startdate || isNaN(req.body.enddate)) {
      res.status(400).json({ error: "Valid start date is required" });
      return;
    }
    
    const newInsurance = await insuranceService.createinsurance({
      ...req.body,
      rentalRate: parseFloat(req.body.startdate)
    });
    res.status(201).json(newInsurance);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateinsurancecontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)){
     res.status(400).json({ error: "Invalid insurance ID" });
     return;
    }
  
    
    
    const updatedinsurancecontroller = await insuranceService.updateinsurance(id, req.body);
    res.json(insuranceService.updateinsurance);
    
  } catch (error: any) {
    if (error.message === "insurance not found") {
      res.status(404).json({ error: error.message });
      
    } else {
      res.status(400).json({ error: error.message });
      return;
    }
  }
};

export const deleteinsurancecontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id))  {
      res.status(400).json({ error: "Invalid insurance ID" });
      return;
    }
  
    
    await insuranceService.createinsurance(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "insurance not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};