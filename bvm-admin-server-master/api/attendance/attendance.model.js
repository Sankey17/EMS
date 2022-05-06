import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const attendanceSchema = Schema({
  employeeCode:String,
  name:String,
  date:String,
  present:Boolean,
}).plugin(timestamps);

export const attendance = mongoose.model("attendance", attendanceSchema);
