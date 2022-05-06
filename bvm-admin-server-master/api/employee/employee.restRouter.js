import express from "express";
import employeeController from "./employee.controller";
export const employeeRouter = express.Router();


employeeRouter.route("/").get(employeeController.getAll).post(employeeController.createOne);
employeeRouter.route("/getemployee").post(employeeController.getEmployee);
employeeRouter.route("/find").post(employeeController.findEmployeeByEmail);
employeeRouter.route("/updatedetail").post(employeeController.updateDetails);
employeeRouter.route("/updateStatus/:Employee_id").put(employeeController.InactiveStatus);
employeeRouter.route("/application").post(employeeController.leaveForm);
employeeRouter.route("/leaveupdate").post(employeeController.LeaveUpdate);
