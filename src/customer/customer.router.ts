import { Router } from "express";
import * as controller from './customer.controller';
import { authenticate } from "../middleware/auth";
import { requireRole, requireAnyRole } from "../middleware/requirerole";

const router = Router();

// Admin creates customers
router.post("/", authenticate, requireRole("admin"), controller.createcustomerController);

// Admin views all customers
router.get("/", authenticate, requireRole("admin"), controller.getAllcustomercontroller);

// User or admin gets customer by ID
router.get("/:id", authenticate, requireAnyRole("user", "admin"), controller.getcustomerByIdcontroller);

// User or admin updates customer info
router.put("/:id", authenticate, requireAnyRole("user", "admin"), controller.updatecustomercontroller);

// Admin deletes customers
router.delete("/:id", authenticate, requireRole("admin"), controller.deletecustomercontroller);

// Get detailed data (bookings, payments)
router.get("/:id/details", authenticate, requireAnyRole("user", "admin"), controller.getCustomerDetailsController);

export default router;
