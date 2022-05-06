import { time } from "cron";
import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const checkInCheckOutSchema = Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    employeeCode: {
        type: String
    },
    employeeName: {
        type: String,
        required: true
    },
    date: {
        type: String,
    },
    checkIn: {
        type: String
    },
    checkOut: {
        type: String,
    },
    totalWork: {
        type: String,
    },
    status: {
        type: String,
        default:"Active"
    }
}).plugin(timestamps);

export const CheckInCheckOut = mongoose.model('checkInCheckOut', checkInCheckOutSchema)