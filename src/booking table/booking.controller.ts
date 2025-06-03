

import {
    createBookingService,
    getAllBookingsService,
    getBookingByIdService,
    updateBookingService,
    deleteBookingService,
  } from "../booking table/booking.service";
 
  import { Request, Response } from "express";
 
  // CREATE booking controller
  export const createBookingController = async (req: Request, res: Response) => {
    try {
      const booking = req.body;
 
      // Ensure required fields are present and valid
      if (!booking.carID || !booking.customerID || !booking.rentalStartDate || !booking.rentalEndDate) {
         res.status(400).json({ message: "Missing required fields" });
         return;
      }
 
      booking.rentalStartDate = new Date(booking.rentalStartDate);
      booking.rentalEndDate = new Date(booking.rentalEndDate);
 
      const newBooking = await createBookingService(booking);
      if (!newBooking) {
         res.status(400).json({ message: "Booking not created" });
         return;
      }
 
     res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error: any) {
       res.status(500).json({ error: error.message });
    }
  };
 
  // GET all bookings controller
  export const getAllBookingsController = async (_req: Request, res: Response) => {
    try {
      const bookings = await getAllBookingsService();
      if (!bookings || bookings.length === 0) {
         res.status(404).json({ message: "No bookings found" });
         return;
      }
 
       res.status(200).json({ data: bookings });
       return;
    } catch (error: any) {
       res.status(500).json({ error: error.message });
       return;
    }
  };
 
  // GET booking by ID controller
  export const getBookingByIdController = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
         res.status(400).json({ message: "Invalid booking ID" });
         return;
      }
 
      const booking = await getBookingByIdService(id);
      if (!booking) {
         res.status(404).json({ message: "Booking not found" });
         return;
      }
 
     res.status(200).json({ data: booking });
     return;
    } catch (error: any) {
       res.status(500).json({ error: error.message });
       return;
    }
  };
 
  // UPDATE booking by ID controller
  export const updateBookingController = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
         res.status(400).json({ message: "Invalid booking ID" });
         return;
      }
 
      const updates = req.body;
      if (updates.rentalStartDate) updates.rentalStartDate = new Date(updates.rentalStartDate);
      if (updates.rentalEndDate) updates.rentalEndDate = new Date(updates.rentalEndDate);
 
      const existingBooking = await getBookingByIdService(id);
      if (!existingBooking) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }
 
      const updated = await updateBookingService(id, updates);
      if (!updated) {
         res.status(400).json({ message: "Booking not updated" });
         return;
      }
 
       res.status(200).json({ message: "Booking updated successfully" });
       return;
    } catch (error: any) {
       res.status(500).json({ error: error.message });
       return;
    }
  };
 
  // DELETE booking by ID controller
  export const deleteBookingController = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
         res.status(400).json({ message: "Invalid booking ID" });
         return;
      }
 
      const existingBooking = await getBookingByIdService(id);
      if (!existingBooking) {
     res.status(404).json({ message: "Booking not found" });
     return;
      }
 
      const deleted = await deleteBookingService(id);
      if (!deleted) {
         res.status(400).json({ message: "Booking not deleted" });
         return;
      }
 
       res.status(204).json({ message: "Booking deleted successfully" });
       return;
    } catch (error: any) {
       res.status(500).json({ error: error.message });
       return;
    }
  };

