import Express from "express";
import {
  registerCustomerController,
  loginCustomerController,
  verifyCustomerController,
} from "./auth.controller";

const router = Express.Router();

// User registration
router.post("/register", async (req, res, next) => {
  try {
    await registerCustomerController(req, res);
  } catch (error) {
    next(error);
  }
});

// Admin registration (same controller, but role must be sent in body)
router.post("/register/admin", async (req, res, next) => {
  try {
    req.body.role = "admin"; // Force admin role for this route
    await registerCustomerController(req, res);
  } catch (error) {
    next(error);
  }
});

// Email verification
router.post("/verify", async (req, res, next) => {
  try {
    await verifyCustomerController(req, res);
  } catch (error) {
    next(error);
  }
});

// Login (common route for both user/admin)
router.post("/login", async (req, res, next) => {
  try {
    await loginCustomerController(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
