import { Request, Response } from 'express';
import * as Locationservice from './location.service';

export const getAllLocationcontroller = async (req: Request, res: Response) => {
  try {
    const location = await Locationservice.getAlllocation();
    res.json(location);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getlocationByIdcontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid Location ID" });
      return;
    }
    
    const Location = await Locationservice.getlocationById(id);
    console.log("Location ID:", Location);
    res.status(200).json(Location);
    return;
  } catch (error: any) {
    if (error.message === "location not found") {
      res.status(404).json({ error: error.message });
      return;
    } else {
      res.status(500).json({ error: error.message });
      return;
    }
  }
};

export const createLocationController = async (req: Request, res: Response) => {
  try {
    console.log(req.body,req.body.locationName,req.body.locationID);
    if (!req.body.locationName ) {
      res.status(400).json({ error: "Valid location is required" });
      return;
    }
    
    const newLocation = await Locationservice.createLocationtableController({
      ...req.body,
      rentalRate: parseFloat(req.body.locationnamme)
    });
    res.status(201).json(newLocation);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateLocationcontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)){
     res.status(400).json({ error: "Invalid location ID" });
     return;
    }
  
    
    
    const updatedlocationcontroller = await Locationservice.updateinsurance(id, req.body);
    res.json(updatedlocationcontroller);
    
  } catch (error: any) {
    if (error.message === "location not found") {
      res.status(404).json({ error: error.message });
      
    } else {
      res.status(400).json({ error: error.message });
      return;
    }
  }
};

export const deletelocationcontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id))  {
      res.status(400).json({ error: "Invalid location ID" });
      return;
    }
  
    
   // await Locationservice.createLocation(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "LOCATION not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};