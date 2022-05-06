import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const usersSchema = Schema({
  employeeCode: String,
  firstName: String,
  lastName: String,
  email: String,
  designation: String,
  qualification: String,
  dateOfBirth: Date,
  streetAddress: String,
  dateOfJoin:Date,
  pincode: Number,
  leave:[{leaveReason:String,leaveStatus:String,leaveDate:String,leaveDateFrom:String,updatedBy:String}],
  status:String,
  visited:Boolean,
  username: String,
  userEmailId: String,
  emailId: String,
  gender:String,
  phone:Number,
  country:String,
  state:String,
  password: String,
  city:String,
  photo:String,
  role:String,
  onboardingStatus:String
}).plugin(timestamps);

export const Users = mongoose.model("users", usersSchema);
