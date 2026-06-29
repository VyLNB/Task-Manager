import mongoose from "mongoose";

const TimesheetSchema = new mongoose.Schema(
    {
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tasks',
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'workspaces',
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        startTime: {
            type: String, // format: "HH:mm"
            required: true
        },
        endTime: {
            type: String, // format: "HH:mm"
            required: true
        },
        hours: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        result: {
            type: String
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending'
        },
        pmComment: {
            type: String
        }
    },
    { timestamps: true }
);

export const TimesheetModel = mongoose.model('timesheets', TimesheetSchema, 'timesheets');
