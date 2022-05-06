import express from "express";
import holidayController from "./holidays.controller";

export const holidayRouter = express.Router();

holidayRouter
    .route("/")
    .get(holidayController.getHolidays)
    .post(holidayController.createAndPutHolidays)
    .delete (holidayController.removeHoliday)
    .post(holidayController.createAndPutHolidays)

holidayRouter
    .route("/month")
    .post(holidayController.getHolidaysMonth)
