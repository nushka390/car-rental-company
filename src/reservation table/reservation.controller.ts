import { Request, Response } from 'express';
import * as ReservationService from './reservation.service';
import { updatePayment } from '../payment table/payment.service';


export const getAllReservationcontroller = async (req: Request, res: Response) => {
  try {
   
    const allReservations = ReservationService.getAllReservations();
    if (!allReservations) {
      res.status(404).json({ error: "No reservations found" });
      return;
    }
    res.json(allReservations);
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
    
    const Reservation = ReservationService.getAllReservation(id);
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
    console.log("REserrrrrvation",  req.body, req.body.ReservationID, req.body.customerID);
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

    const updatedReservation = await ReservationService.updateReservation(id, req.body);
    res.json(updatedReservation);

  } catch (error: any) {
    if (error.message === "Reservation not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
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

    const reservation = await ReservationService.getReservationByIdService(id);
    if (!reservation) {
      res.status(404).json({ error: "Reservation not found" });
      return;
    }

    // Ensure reservation has PaymentID property
 //   await updatePayment(reservation. { status: 'cancelled' });
    await ReservationService.deleteReservation(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "Payment not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};