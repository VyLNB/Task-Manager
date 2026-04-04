import mongoose from 'mongoose';

const ToDoSchema = new mongoose.Schema(
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
        }
    },
    { timestamps: true }
);

const ToDoModel = mongoose.model('ToDoItems', ToDoSchema, 'ToDoItems');

export default ToDoModel;