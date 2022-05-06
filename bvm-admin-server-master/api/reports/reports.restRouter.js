import express from "express";
import reportsController from "./reports.controller";

export const reportsRouter = express.Router();

reportsRouter
    .route("/fetch")
    .get(reportsController.getReportsByPage)
    .post(reportsController.postEmployeeReport);