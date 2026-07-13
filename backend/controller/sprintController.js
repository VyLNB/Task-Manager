import SprintModel from '../model/SprintModel.js';
import { checkIsWorkspaceLeader } from '../utils/roleHelper.js';

export const createSprint = async (req, res) => {
    try {
        const { name, startDate, endDate, workspaceId } = req.body;
        const currentUserId = req.userId;

        if (!name || !startDate || !endDate || !workspaceId) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin Sprint" });
        }

        const isLeader = await checkIsWorkspaceLeader(workspaceId, currentUserId);
        if (!isLeader) {
            return res.status(403).json({ message: "Chỉ PM mới có quyền tạo Sprint" });
        }

        const newSprint = new SprintModel({
            name,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            workspaceId
        });

        const savedSprint = await newSprint.save();
        res.status(201).json({
            message: "Tạo Sprint thành công",
            data: savedSprint
        });
    } catch (error) {
        console.error("Lỗi khi tạo Sprint:", error);
        res.status(500).json({
            message: "Lỗi khi tạo Sprint",
            error: error.message
        });
    }
};

export const getSprintsByWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const sprints = await SprintModel.find({ workspaceId }).sort({ startDate: 1 });
        
        res.status(200).json({
            message: "Lấy danh sách Sprint thành công",
            data: sprints
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách Sprint",
            error: error.message
        });
    }
};

export const updateSprint = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, startDate, endDate, status } = req.body;
        const currentUserId = req.userId;

        const sprint = await SprintModel.findById(id);
        if (!sprint) {
            return res.status(404).json({ message: "Không tìm thấy Sprint" });
        }

        const isLeader = await checkIsWorkspaceLeader(sprint.workspaceId, currentUserId);
        if (!isLeader) {
            return res.status(403).json({ message: "Chỉ PM mới có quyền cập nhật Sprint" });
        }

        if (name) sprint.name = name;
        if (startDate) sprint.startDate = new Date(startDate);
        if (endDate) sprint.endDate = new Date(endDate);
        if (status) sprint.status = status;

        const updatedSprint = await sprint.save();
        res.status(200).json({
            message: "Cập nhật Sprint thành công",
            data: updatedSprint
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi cập nhật Sprint",
            error: error.message
        });
    }
};

export const deleteSprint = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.userId;

        const sprint = await SprintModel.findById(id);
        if (!sprint) {
            return res.status(404).json({ message: "Không tìm thấy Sprint" });
        }

        const isLeader = await checkIsWorkspaceLeader(sprint.workspaceId, currentUserId);
        if (!isLeader) {
            return res.status(403).json({ message: "Chỉ PM mới có quyền xóa Sprint" });
        }

        await SprintModel.findByIdAndDelete(id);
        res.status(200).json({
            message: "Xóa Sprint thành công"
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi xóa Sprint",
            error: error.message
        });
    }
};
