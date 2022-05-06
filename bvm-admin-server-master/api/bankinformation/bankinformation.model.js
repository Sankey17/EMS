import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const bankInformationSchema = Schema({
  employeeId: Schema.Types.ObjectId,
  bankName: String,
  bankAccountNo: String,
  ifscCode: String,
  panNo: String

}).plugin(timestamps);

export const BankInformation = mongoose.model("bankInformation", bankInformationSchema);
