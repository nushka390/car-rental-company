import { Request, Response } from 'express';
import * as CustomerService from './customer.service';
import { getCustomerDetails } from "../drizzle/queries/customerDetails";

export const getAllcustomercontroller = async (req: Request, res: Response) => {
  try {
    const customer = await CustomerService.getAllcustomers();
    if (!customer || customer.length === 0) {
      res.status(404).json({ error: "No customers found" });
      return;
    }
    res.status(200).json(customer);
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
    console.log(req.body)
    if (!req.body.firstName ) {
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


export const getCustomerDetailsController = async (req: Request, res: Response):Promise<void> => {
  try {
    const customerId = Number(req.params.id);
    if (isNaN(customerId)) {
      res.status(400).json({ error: "Invalid customer ID" });
      return;
    }

    const data = await getCustomerDetails(customerId);

    // const formatted = {
    //   customer: {
    //     id: data[0]?.CustomerTable?.id,
    //     name: data[0]?.CustomerTable?.name,
    //     email: data[0]?.CustomerTable?.email,
    //   },
    //   bookings: data.map(row => ({
    //     bookingId: row.BookingTable?.id,
    //     date: row.BookingTable?.date,
    //     carId: row.BookingTable?.carId,
    //     payment: {
    //       paymentId: row.PaymentTable?.id,
    //       amount: row.PaymentTable?.amount,
    //       status: row.PaymentTable?.status
    //     }
    //   }))
    // };

    res.json(data);
  } catch (err) {
    console.error("Error fetching customer details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
