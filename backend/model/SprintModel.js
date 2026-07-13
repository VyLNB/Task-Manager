import mongoose from 'mongoose';

const SprintSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'workspaces',
            required: true
        },
        status: {
            type: String,
            enum: ['Planned', 'Active', 'Completed'],
            default: 'Planned'
        }
    },
    { timestamps: true }
);

SprintSchema.index({ workspaceId: 1 });

const SprintModel = mongoose.model('sprints', SprintSchema, 'sprints');

export default SprintModel;
