import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const courseSchema = Schema({
  description: String,
  course: String,
  fees: String,

}).plugin(timestamps);

export const Course = mongoose.model("course", courseSchema);
