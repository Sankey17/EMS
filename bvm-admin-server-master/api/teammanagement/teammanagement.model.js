import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const teammanagmentSchema = Schema({
  teamleadname: String,
  department: String,
  employee: Array,
  totalemployee: Number,
});

export const Teammanagment = mongoose.model(
  "teammanagment",
  teammanagmentSchema
);
