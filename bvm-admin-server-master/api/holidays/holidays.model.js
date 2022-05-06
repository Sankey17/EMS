import mongoose, {Schema} from "mongoose";
import timestamps from "mongoose-timestamp";

const holidaysSchema = Schema({
  date: {
    type: Number,
    required: true
  },
  day: String,
  title: {
    type: String,
    required: true
  }
}).plugin(timestamps);

export const Holidays = mongoose.model("holidays", holidaysSchema);
