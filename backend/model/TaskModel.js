import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        status: {
            type: String,
            enum: ['TO DO', 'IN PROGRESS', 'COMPLETED'],
            default: 'TO DO'
        },
        position: {
            type: Number,
            required: true,
            default: 0,
        },
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspaces',
            required: false,
            default: null,
            description: "Task này thuộc về Nhóm/Dự án nào (nếu để trống là cá nhân)"
        },
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
            description: "Người đã tạo ra task này"
        },
        assigneeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            default: null,
            description: "Thành viên được Leader giao thực hiện task này"
        },
        priority: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH'],
            default: 'MEDIUM'
        },
        dueDate: {
            type: Date,
            required: false
        },
        startDate: {
            type: Date,
            required: false
        },
        tags: {
            type: [String],
            default: []
        },
    },
    { timestamps: true }
);

TaskSchema.index({ workspaceId: 1 });
TaskSchema.index({ assigneeId: 1 });

const TaskModel = mongoose.model('Tasks', TaskSchema, 'Tasks');

export default TaskModel;