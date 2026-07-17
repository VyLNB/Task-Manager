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
            ref: 'workspaces',
            required: true,
            description: "Task này thuộc về Nhóm/Dự án nào"
        },
        sprintId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sprints',
            required: false,
            description: "Task thuộc về Sprint nào (nếu có)"
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
        estimatedHours: {
            type: Number,
            required: false,
            description: "Số giờ dự kiến để hoàn thành"
        },
        taskType: {
            type: String,
            enum: ['Planned', 'Sub-task', 'Bug Fixing', 'Ad-hoc'],
            default: 'Planned',
            description: "Loại công việc"
        },
        isPaused: {
            type: Boolean,
            default: false,
            description: "PM tạm dừng task này"
        },
        isCancelled: {
            type: Boolean,
            default: false,
            description: "PM hủy task này"
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
        editHistory: [
            {
                updatedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Users',
                    required: true
                },
                fieldsChanged: {
                    type: [String],
                    required: true
                },
                timestamp: {
                    type: Date,
                    default: Date.now
                },
                note: {
                    type: String,
                    required: false
                }
            }
        ]
    },
    { timestamps: true }
);

TaskSchema.index({ workspaceId: 1 });
TaskSchema.index({ sprintId: 1 });
TaskSchema.index({ assigneeId: 1 });

const TaskModel = mongoose.model('tasks', TaskSchema, 'tasks');

export default TaskModel;