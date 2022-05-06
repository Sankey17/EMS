import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";

const watchSchema = Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  employeeCode: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
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
  workTime: Number,
  lunchTime: Number,
  breakTime: Number,
  watchStartTime: Number,
  lunchStart: Boolean,
  breakStart: Boolean,
  workStart: Boolean,
}).plugin(timestamps);

export const Watch = mongoose.model("watch", watchSchema);
