import { Router } from "express";
import * as controller from './maintenance.controller';

const router = Router();

  router.post("/",controller.createMaintenanceController);

  router.get("/", controller.getAllMaintenancecontroller);
  router.get("/:id", controller.getMaintenanceByIdcontroller);
  router.put("/:id",controller.updateMaintenancecontroller);
  router.delete("/:id",controller.deleteMaintenancecontroller);


export default router;


