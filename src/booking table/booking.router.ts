import express from "express";
import {
  createBookingController,
  getAllBookingsController,
  getBookingByIdController,
  updateBookingController,
  deleteBookingController
} from "./booking.controller";

const router = express.Router();
router.post("/", createBookingController);

// router.get("/", getAllBookingsController);

router.route("/").get(getAllBookingsController);

router.get("/:id", getBookingByIdController);

router.put("/:id", updateBookingController);

router.delete("/:id", deleteBookingController);

export default router;