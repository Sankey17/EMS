import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const workReportSchema = Schema({
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
        required: true
    },
    project: {
        type: String,
        required: true
    },
    task: {
        type: String,
        required: true
    },
    hours: {
        type: Number,
        required: true
    },
    minutes: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required:true
    }
}).plugin(timestamps);

export const WorkReport = mongoose.model('workReport', workReportSchema)