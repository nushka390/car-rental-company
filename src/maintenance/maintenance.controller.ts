import { Request, Response } from 'express';
import * as Maintenanceservice from './maintenance.service';

export const getAllMaintenancecontroller = async (req: Request, res: Response) => {
  try {
    const Maintenance = await  Maintenanceservice.getAllMaintenance();
    res.json(Maintenance);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMaintenanceByIdcontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid  Maintenance ID" });
      return;
    }
    
    const  Maintenance = await  Maintenanceservice.getCarMaintenanceId(id);
    res.json( Maintenance);
    return;
  } catch (error: any) {
    if (error.message === " Maintenance not found") {
      res.status(404).json({ error: error.message });
      return;
    } else {
      res.status(500).json({ error: error.message });
      return;
    }
  }
};

export const createMaintenanceController = async (req: Request, res: Response) => {
  try {
    if (!req.body.MaintenanceId) {
      res.status(400).json({ error: "Valid mainenanceid is required" });
      return;
    }
    
    const newMaintenance = await  Maintenanceservice.deleteMaintenance({
      ...req.body,
       Maintenanceid: parseFloat(req.body. Maintenanceid)
    });
    res.status(201).json(newMaintenance);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateMaintenancecontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)){
     res.status(400).json({ error: "Invalid maintenance ID" });
     return;
    }
  
    
    
    const updatedMaintenance = await  Maintenanceservice.updatemaintenance(id, req.body);
    res.json(updatedMaintenance);
    
  } catch (error: any) {
    if (error.message === " Maintenance not found") {
      res.status(404).json({ error: error.message });
      
    } else {
      res.status(400).json({ error: error.message });
      return;
    }
  }
};

export const deleteMaintenancecontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id))  {
      res.status(400).json({ error: "Invalid  Maintenance ID" });
      return;
    }
  
    
    await  Maintenanceservice.deleteMaintenance(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === " Maintenance not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};