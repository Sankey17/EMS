import express from "express";
import salaryController from "./salary.controller";

export const salaryRouter = express.Router();

salaryRouter
    .route("/")
    .get(salaryController.getAll)
    .post(salaryController.createOne);

salaryRouter
    .route("/checksalary")
    .post(salaryController.checkDetails);

salaryRouter
    .route("/find")
    .post(salaryController.findDetails);

salaryRouter
    .route("/filter")
    .post(salaryController.filterData);
