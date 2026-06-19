import mongoose from "mongoose";

const WorkspaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        },
        status: {
            type: String,
            enum: ['Kế hoạch', 'Đang thực hiện', 'Đã hoàn thành', 'Tạm dừng'],
            default: 'Kế hoạch'
        },
        leader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            }
        ],
    },
    { timestamps: true }
)

export const WorkspaceModel = mongoose.model('workspaces', WorkspaceSchema, 'workspaces')