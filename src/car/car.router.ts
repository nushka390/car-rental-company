import { Router } from "express";
import * as controller from './car.controller';

const router = Router();

  router.route("/").post(controller.createcarController);
  // router.post("/",controller.createcarController);

  router.get("/", controller.getAllCarscontroller);
  router.get("/:id", controller.getCarByIdcontroller);
  router.put("/:id",controller.updatecarcontroller);
  router.delete("/:id",controller.deleteCarcontroller);


export default router;


