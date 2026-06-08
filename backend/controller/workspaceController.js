import { WorkspaceModel } from "../model/WorkspaceModel.js";
import UserModel from "../model/UserModel.js";

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
            .populate("leader", "fullName email")
            .populate("members", "fullName email")
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

export const inviteMember = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { email } = req.body;
        const currentUserId = req.userId;

        //kiểm tra workspace
        const workspace = await WorkspaceModel.findById(workspaceId);
        if (!workspace){
            return res.status(404).json({
                message: 'Not found workspace'
            });
        }

        //kiểm tra leader
        if (workspace.leader.toString() !== currentUserId){
            return res.status(403).json({
                message: 'You are not authorized to invite members to this workspace'
            });
        }

        //tìm user theo email
        const userToInvite = await UserModel.findOne({email});
        if (!userToInvite){
            return res.status(404).json({
                message:'User not found'
            });
        }
        
        //kiểm tra đã là member chưa
        const alreadyMemeber = workspace.members.some(
            member => member.toString() === userToInvite._id.toString()
        );

        if (alreadyMemeber){
            return res.status(400).json({
                message:'User is already a member of this workspace'
            });
        }
        workspace.members.push(userToInvite._id);  
        await workspace.save();
        
        return res.status(200).json({
            message: 'Invite memeber successfully',
            member: {
                _id: userToInvite._id,
                fullName: userToInvite.fullName,
                email: userToInvite.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error inviting member',
            error: error.message
        });
    }
}