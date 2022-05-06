import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const reportsSchema = Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'employee' },
  date: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  day: {
    type: Number,
    required: true
  },
  report: {
    type: String,
    required: true
  }
}).plugin(timestamps);

export const Reports = mongoose.model("reports", reportsSchema);
