import mongoose from 'mongoose';

const TaskChangeRequestSchema = new mongoose.Schema(
    {
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tasks',
            required: true,
            description: "ID của Task cần thay đổi"
        },
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'workspaces',
            required: true,
            description: "ID của Dự án (để dễ dàng lấy ra theo PM)"
        },
        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
            description: "Người yêu cầu (thường là Assignee)"
        },
        changes: {
            estimatedHours: { old: Number, new: Number },
            startDate: { old: Date, new: Date },
            dueDate: { old: Date, new: Date }
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending'
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            default: null
        },
        reviewedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

export const TaskChangeRequestModel = mongoose.model('task_change_requests', TaskChangeRequestSchema, 'task_change_requests');
