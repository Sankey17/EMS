import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const studentSchema = Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: Number,
  dateOfBirth: Date,
  address: String,
  dateOfJoin:Date,
  tags: Array,
  gender:String,
}).plugin(timestamps);

export const Student = mongoose.model("student", studentSchema);
