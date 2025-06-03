import { Router } from "express";
import * as controller from './insurance.controller';

const router = Router();

  router.post("/",controller.createinsuranceController);

  router.get("/", controller.getAllinsurancecontroller);
  router.get("/:id", controller.getInsuranceByIdcontroller);
  router.put("/:id",controller.updateinsurancecontroller);
  router.delete("/:id",controller.deleteinsurancecontroller);


export default router;


