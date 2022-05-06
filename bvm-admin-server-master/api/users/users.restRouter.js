import express from "express";
import usersController from "./users.controller";

export const usersRouter = express.Router();


usersRouter
  .route("/")
  .get(usersController.getAll)
  .post(usersController.createOne);
usersRouter
  .route("/profileuser")
  .post(usersController.ProfileData);
usersRouter
  .route("/count")
  .get(usersController.countData);
usersRouter
  .route("/updateprofiledetails/:Users_id")
  .put(usersController.UpdateProfileData);
usersRouter
  .route("/checkbirthday")
  .get(usersController.CheckBirthday);
usersRouter
  .route("/pdf")
  .post(usersController.generatePdf);

