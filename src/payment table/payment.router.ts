import { Router } from "express";
import * as controller from './payment.controller';

const router = Router();

  router.post("/",controller.createPaymentController);

  router.get("/", controller.getAllPaymentcontroller);
  router.get("/:id", controller.getPaymentByIdcontroller);
  router.put("/:id",controller.updatePaymentcontroller);
  router.delete("/:id",controller.deletePaymentcontroller);


export default router;


