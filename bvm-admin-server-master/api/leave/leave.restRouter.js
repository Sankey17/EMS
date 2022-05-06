import express from "express";
import leaveController from "./leave.controller";
export const leaveRouter = express.Router();


leaveRouter.route("/")
  .post(leaveController.createAndPutLeave);

leaveRouter.route("/search")
  .post(leaveController.getLeaveByQuery);