import { Router } from "express";
import * as controller from './reservation.controller';

const router = Router();

  router.post("/",controller.createReservationController);

  router.get("/", controller.getAllReservationcontroller);
  router.get("/:id", controller.getReservationByIdcontroller);
  router.put("/:id",controller.updateReservationcontroller);
  router.delete("/:id",controller.deleteReservationcontroller);


export default router;


