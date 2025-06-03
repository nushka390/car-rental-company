import { Request, Response } from 'express';
import * as PaymentService from './payment.service';


export const getAllPaymentcontroller = async (req: Request, res: Response) => {
  try {
    const Payment = await PaymentService.getAllPayment();
    res.json(Payment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPaymentByIdcontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid Payment ID" });
      return;
    }
    
    const Payment = await PaymentService.getPaymentById(id);
    res.json(Payment);
    return;
  } catch (error: any) {
    if (error.message === "Payment not found") {
      res.status(404).json({ error: error.message });
      return;
    } else {
      res.status(500).json({ error: error.message });
      return;
    }
  }
};

export const createPaymentController = async (req: Request, res: Response) => {
  try {
    if (!req.body.PaymentID ) {
      res.status(400).json({ error: "Valid PaymentID is required" });
      return;
    }
    
    const newPayment = await PaymentService.CreatePayment({
      ...req.body,
      payment: parseFloat(req.body.PaymentID)
    });
    res.status(201).json(newPayment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updatePaymentcontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)){
     res.status(400).json({ error: "Invalid Payment ID" });
     return;
    }
  
    
    
    const updatePayment = await PaymentService.updatePayment(id, req.body);
    res.json(updatePayment);
    
  } catch (error: any) {
    if (error.message === "Payment not found") {
      res.status(404).json({ error: error.message });
      
    } else {
      res.status(400).json({ error: error.message });
      return;
    }
  }
};

export const deletePaymentcontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id))  {
      res.status(400).json({ error: "Invalid Payment ID" });
      return;
    }
  
    
    await PaymentService.deletePayment(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "Payment not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};