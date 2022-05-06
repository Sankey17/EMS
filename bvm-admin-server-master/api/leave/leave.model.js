import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const leaveSchema = Schema({
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
    designation: String,
    leaveReason: String,
    leaveStatus: String,
    leaveDateTo: String,
    leaveDateFrom: String,
    type: String,
    otherReason: String,
    typeOfDay: String,
    hours: Number,
    updatedBy: String
}).plugin(timestamps);

export const Leave = mongoose.model("leave", leaveSchema);