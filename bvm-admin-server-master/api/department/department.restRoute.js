import express from "express";
import departmentController from "./department.controller";

export const departmentRouter = express.Router();

departmentRouter
  .route("/")
  .post(departmentController.postDepartment)
  .get(departmentController.getDepartment)

departmentRouter
  .route("/:department_id")
  .delete(departmentController.deleteDepartment)

departmentRouter
  .route("/:department_id")
  .put(departmentController.updateDepartment)




