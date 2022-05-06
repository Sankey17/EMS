import express from "express";
import attendanceController from "./attendance.controller";

export const attendanceRouter = express.Router();

attendanceRouter
    .route("/")
    .get(attendanceController.getAll)
    .post(attendanceController.createOne);

attendanceRouter
    .route("/post")
    .post(attendanceController.postAttendance);

attendanceRouter
    .route("/checkattendance")
    .post(attendanceController.checkAttendance);

attendanceRouter
  .route("/chart")
  .get(attendanceController.getAttendanceChart);