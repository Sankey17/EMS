import express from "express";
import designationController from "./designation.controller";

export const designationRouter = express.Router();

designationRouter
  .route("/")
  .post(designationController.postDesignation)
  .get(designationController.getDesignation);

designationRouter
  .route("/:designation_id")
  .delete(designationController.deleteDesignation);

designationRouter 
  .route("/:designation_id")
  .put(designationController.updateDesignation);