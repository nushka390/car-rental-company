import { Router } from "express";
import * as controller from './location.controller';

const router = Router();

  router.post("/",controller.createLocationController);

  router.get("/", controller.getAllLocationcontroller);
  router.get("/:id", controller.getlocationByIdcontroller);
  router.put("/:id",controller.updateLocationcontroller);
  router.delete("/:id",controller.deletelocationcontroller);


export default router;


