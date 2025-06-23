import { Request, Response } from "express";
import {
  createCustomerService,
  getCustomerByEmailService,
  verifyCustomerService,
  loginCustomerService
} from "./auth.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../mailer/mailer";
import "dotenv/config"

export const registerCustomerController = async (req: Request, res: Response) => {
  try {
    const customer = req.body;
    const hashedPassword = bcrypt.hashSync(customer.password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = {
      ...customer,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
      role: customer.role || "user"
    };

    await createCustomerService(user);

    try {
      await sendEmail(
        user.email,
        "Verify Your Account",
        `Hello ${user.lastName}, your verification code is: ${verificationCode}`,
        `<div><h2>Hello ${user.lastName},</h2><p>Your verification code is: <strong>${verificationCode}</strong></p></div>`
      );
    } catch (err) {
      console.error("Failed to send verification email:", err);
    }

    return res.status(201).json({ message: "User created. Verification code sent to email." });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const registerAdminController = async (req: Request, res: Response) => {
  try {
    req.body.role = "admin";
    return await registerCustomerController(req, res);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const verifyCustomerController = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  try {
    const user = await getCustomerByEmailService(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.verificationCode === code) {
      await verifyCustomerService(email);

      try {
        await sendEmail(
          email,
          "Account Verified",
          `Hello ${user.lastName}, your account is now verified.`,
          `<div><p>Your account is verified. You may now login.</p></div>`
        );
      } catch (err) {
        console.error("Failed to send verification success email:", err);
      }

      return res.status(200).json({ message: "User verified successfully" });
    }

    return res.status(400).json({ message: "Invalid verification code" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const loginCustomerController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await loginCustomerService(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email first" });
    }

    const token = jwt.sign(
      {
        sub: user.customerID,
        role: user.role,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.customerID,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};