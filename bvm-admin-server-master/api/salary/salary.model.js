import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";

const salarySchema = Schema({
  employeeId: String,
  firstName: String,
  month:Number,
  salary:String,
  status:String,
  year:Number
}).plugin(timestamps);

export const Salary = mongoose.model("Salary", salarySchema);
