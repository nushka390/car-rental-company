import { Request, Response } from 'express';
import * as CustomerService from './customer.service';

export const getAllcustomercontroller = async (req: Request, res: Response) => {
  try {
    const customer = await CustomerService.getAllcustomers();
    res.json(customer);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getcustomerByIdcontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid customer ID" });
      return;
    }
    
    const customer = await CustomerService.getcustomerById(id);
    res.json(customer);
    return;
  } catch (error: any) {
    if (error.message === "customer not found") {
      res.status(404).json({ error: error.message });
      return;
    } else {
      res.status(500).json({ error: error.message });
      return;
    }
  }
};    

//create newcustomer function
export const createcustomerController = async (req: Request, res: Response) => {
  try {
    if (!req.body.customer || isNaN(req.body.customer)) {
      res.status(400).json({ error: "Valid customer is required" });
      return;
    }
    
    const newcustomer = await CustomerService.Createcustomer({
      ...req.body,
      customer: parseFloat(req.body.customer)
    });
    
    res.status(201).json(newcustomer);
  } catch (error: any) {
    if (error.message === "customer already exists") {
      res.status(409).json({ error: error.message });
    }
    else {
      res.status(400).json({ error: error.message });
    }
  }
}

export const updatecustomercontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)){
     res.status(400).json({ error: "Invalid customer ID" });
     return;
    }
  
    
    
    const updateCustomer = await CustomerService.updateCustomer( id,req.body);
    
    res.json(updateCustomer);
    
  } catch (error: any) {
    if (error.message === "customer not found") {
      res.status(404).json({ error: error.message });
      
    } else {
      res.status(400).json({ error: error.message });
      return;
    }
  }
};

export const deletecustomercontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id))  {
      res.status(400).json({ error: "Invalid customer ID" });
      return;
    }
  
    
    await CustomerService.deletecustomer(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "customer not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};