import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const departmentSchema = Schema({
  name:String,
}).plugin(timestamps);

export const Department = mongoose.model("department", departmentSchema);
