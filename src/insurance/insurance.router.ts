import { Router } from "express";
import * as controller from './insurance.controller';
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/requirerole";

const router = Router();

  router.post("/",authenticate, requireRole("admin"),controller.createinsuranceController);

  router.get("/",authenticate, requireRole("admin"), controller.getAllinsurancecontroller);

  router.get("/:id", controller.getInsuranceByIdcontroller);
  router.put("/:id",controller.updateinsurancecontroller);
  router.delete("/:id",controller.deleteinsurancecontroller);


export default router;


