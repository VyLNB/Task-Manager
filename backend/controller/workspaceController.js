import { WorkspaceModel } from "../model/WorkspaceModel.js";

export const createWorkspace = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Vui lòng nhập tên Workspace" });
        }

        const leaderId = req.userId;

        const newWorkspace = new WorkspaceModel({
            name,
            leader: leaderId,
            members: [leaderId]
        });

        const savedWorkspace = await newWorkspace.save();
        res.status(201).json({
            message: "Workspace created successfully",
            data: savedWorkspace
        });
    } catch (error) {
        console.error("Lỗi khi tạo Workspace:", error);
        res.status(500).json({
            message: "Error creating workspace",
            error: error
        });
    }
}

//get workspace list where user is leader or member
export const getWorkspace = async (req, res) => {
    try {
        //get current user
        const userId = req.userId;

        const workspaces = await WorkspaceModel.find({
            $or: [
                { leader: userId },
                { members: userId }
            ]
        })
            .populate("leader", "name email")
            .populate("members", "name email")
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: "Get workspaces successfully",
            data: workspaces
        });
    } catch (err) {
        res.status(500).json({
            message: "Error getting workspaces",
            error: err.message
        });
    }
}