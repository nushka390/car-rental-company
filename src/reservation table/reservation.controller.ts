import { Request, Response } from 'express';
import * as ReservationService from './reservation.service';
import { updatePayment } from '../payment table/payment.service';


export const getAllReservationcontroller = async (req: Request, res: Response) => {
  try {
    const Reservation = ReservationService.getAllreservation(parseInt(req.params.id));
    res.json(Reservation);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getReservationByIdcontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid Reservation ID" });
      return;
    }
    
    const Reservation = ReservationService.getAllreservation(id);
    res.json(Reservation);
    return;
  } catch (error: any) {
    if (error.message === "Reservation not found") {
      res.status(404).json({ error: error.message });
      return;
    } else {
      res.status(500).json({ error: error.message });
      return;
    }
  }
};

export const createReservationController = async (req: Request, res: Response) => {
  try {
    if (!req.body.ReservationID ) {
      res.status(400).json({ error: "Valid ReservationID is required" });
      return;
    }
    
    const newReservation = ReservationService.newReservation({
        ...req.body,
        Reservation: parseFloat(req.body.ReservationID)
    });
    res.status(201).json(newReservation);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateReservationcontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)){
     res.status(400).json({ error: "Invalid Reservation ID" });
     return;
    }
  
    
    
    const ReservationPayment = ReservationService.CreateReservation(id, req.body);
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

export const deleteReservationcontroller = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id))  {
      res.status(400).json({ error: "Invalid Reservation ID" });
      return;
    }
  
    
    ReservationService.deletereservation(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "Payment not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};