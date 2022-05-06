import express from "express";
import teammanegmentController from "./teammanegment.controller";
export const teammanegmentRouter = express.Router();

teammanegmentRouter
  .route("/")
  .post(teammanegmentController.postTeam)
  .get(teammanegmentController.getTeam);

teammanegmentRouter.route("/:id").delete(teammanegmentController.deleteTeam);

teammanegmentRouter.route("/:id").patch(teammanegmentController.updateTeam);
