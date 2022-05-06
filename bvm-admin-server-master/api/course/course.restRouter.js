import express from "express";
import courseController from "./course.controller";
export const courseRouter = express.Router();


courseRouter
  .route("/")
  .post(courseController.postCourse)
  .get(courseController.getCourse)

courseRouter
  .route("/:course_id")
  .delete(courseController.deleteCourse)
  .put(courseController.updateCourse)

courseRouter
  .route("/get/:course_id")
  .get(courseController.getCourseById)
