import { Router } from "express";
import * as controller from './customer.controller';

const router = Router();

  router.post("/",controller.createcustomerController);

  router.get("/", controller.getAllcustomercontroller);
  router.get("/:id", controller.getcustomerByIdcontroller);
  router.put("/:id",controller.updatecustomercontroller);
  router.delete("/:id",controller.deletecustomercontroller);


export default router;


