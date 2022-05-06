import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const employeeSchema = Schema({
  employeeCode: String,
  password:String,
  firstName: String,
  lastName: String,
  email: String,
  phone: Number,
  designation: String,
  qualification: String,
  dateOfBirth: Date,
  streetAddress: String,
  dateOfJoin:Date,
  city: String,
  pic:String,
  state: String,
  pincode: Number,
  gender:String,
  leave:[{leaveReason:String,leaveStatus:String,leaveDate:String,leaveDateFrom:String,updatedBy:String}],
  status:String,
  visited:Boolean,
  onboardingStatus:String,
}).plugin(timestamps);

export const Employee = mongoose.model("employee", employeeSchema);
