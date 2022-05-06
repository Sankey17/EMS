import express from "express";
import studentController from "./student.controller";
export const studentRouter = express.Router();

studentRouter
  .route("/")
  .post(studentController.postStudent)
  .get(studentController.getStudent)

studentRouter
  .route("/:student_id")
  .delete(studentController.deleteStudent)
  .put(studentController.updateStudent)

studentRouter
  .route("/get/:student_id")
  .get(studentController.getStudentById);