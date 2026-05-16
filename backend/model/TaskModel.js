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
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true
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

const TaskModel = mongoose.model('Tasks', TaskSchema, 'Tasks');

export default TaskModel;