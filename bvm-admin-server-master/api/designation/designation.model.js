import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const designationSchema = Schema({
  departmentId: {
    type: Schema.Types.ObjectId,
  },
  designationName: String
}).plugin(timestamps);

export const Designation = mongoose.model("designation", designationSchema);
