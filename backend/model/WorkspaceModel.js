import mongoose from "mongoose";

const WorkspaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
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

export const WorkspaceModel = mongoose.model('Workspaces', WorkspaceSchema, 'Workspaces')