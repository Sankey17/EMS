import express from "express";
import watchController from "./watch.controller";

export const watchRouter = express.Router();

watchRouter
  .route("/")
  .get(watchController.getAll)
  .post(watchController.createOne);

watchRouter
    .route("/timeinfo")
    .get(watchController.getTimeInfo);

watchRouter
    .route("/online")
    .post(watchController.onlineEmployeeList);

watchRouter
  .route("/events")
  .get(watchController.getAllMovementOfCurrnetYear);

watchRouter
  .route("/updatewatch")
  .post(watchController.manuallyUpdateWatch)
  .put(watchController.updateUserWatch);

watchRouter
  .route("/workinghours")
  .post(watchController.getWorkingHours);

watchRouter
  .route("/attendance")
  .post(watchController.getAttendanceHours);