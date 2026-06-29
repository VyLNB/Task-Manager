import { TimesheetModel } from "../model/TimesheetModel.js";
import TaskModel from "../model/TaskModel.js";
import { WorkspaceModel } from "../model/WorkspaceModel.js";
import UserModel from "../model/UserModel.js";

// Member: Create a new timesheet log
export const createTimesheet = async (req, res) => {
    try {
        const { taskId, workspaceId, date, startTime, endTime, hours, description, result } = req.body;
        const userId = req.userId;

        if (!taskId || !workspaceId || !date || !startTime || !endTime || !hours || !description) {
            return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin (taskId, workspaceId, date, startTime, endTime, hours, description)" });
        }

        // Verify that workspace exists and user is a member
        const workspace = await WorkspaceModel.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace không tồn tại" });
        }

        const isMember = workspace.members.some(m => m.toString() === userId) || workspace.leader.toString() === userId;
        if (!isMember) {
            return res.status(403).json({ message: "Bạn không phải thành viên của dự án này" });
        }

        // Verify task exists
        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task không tồn tại" });
        }

        const isLeader = workspace.leader.toString() === userId;

        const newTimesheet = new TimesheetModel({
            taskId,
            userId,
            workspaceId,
            date: new Date(date),
            startTime,
            endTime,
            hours,
            description,
            result,
            status: isLeader ? 'Approved' : 'Pending'
        });

        const savedTimesheet = await newTimesheet.save();

        res.status(201).json({
            message: "Log time thành công",
            data: savedTimesheet
        });

    } catch (error) {
        console.error("Lỗi tạo timesheet:", error);
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
};

// Member: Get their own timesheets
export const getMyTimesheets = async (req, res) => {
    try {
        const userId = req.userId;
        const { workspaceId, startDate, endDate } = req.query;

        let filter = { userId };
        if (workspaceId) {
            filter.workspaceId = workspaceId;
        }

        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const timesheets = await TimesheetModel.find(filter)
            .populate("taskId", "title")
            .populate("workspaceId", "name")
            .sort({ date: -1, startTime: -1 });

        res.status(200).json({
            message: "Lấy danh sách timesheet thành công",
            data: timesheets
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
};

// Member: Update their timesheet (only if Pending or Rejected)
export const updateTimesheet = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const updates = req.body;

        const timesheet = await TimesheetModel.findById(id);
        if (!timesheet) {
            return res.status(404).json({ message: "Không tìm thấy timesheet" });
        }

        if (timesheet.userId.toString() !== userId) {
            return res.status(403).json({ message: "Bạn không có quyền sửa timesheet này" });
        }

        if (timesheet.status === 'Approved') {
            return res.status(400).json({ message: "Không thể sửa timesheet đã được Approve" });
        }

        // Prevent updating status from this endpoint
        delete updates.status;
        delete updates.pmComment;
        
        // If updating date, ensure it's a Date object
        if (updates.date) updates.date = new Date(updates.date);

        // Reset to pending if user updates a rejected timesheet
        updates.status = 'Pending';
        updates.pmComment = '';

        const updatedTimesheet = await TimesheetModel.findByIdAndUpdate(id, updates, { new: true });
        
        res.status(200).json({
            message: "Cập nhật timesheet thành công",
            data: updatedTimesheet
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
};

// Member: Delete their timesheet
export const deleteTimesheet = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const timesheet = await TimesheetModel.findById(id);
        if (!timesheet) {
            return res.status(404).json({ message: "Không tìm thấy timesheet" });
        }

        if (timesheet.userId.toString() !== userId) {
            return res.status(403).json({ message: "Bạn không có quyền xóa timesheet này" });
        }

        if (timesheet.status === 'Approved') {
            return res.status(400).json({ message: "Không thể xóa timesheet đã được Approve" });
        }

        await TimesheetModel.findByIdAndDelete(id);
        
        res.status(200).json({
            message: "Xóa timesheet thành công"
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
};

// PM: Get all timesheets for a workspace
export const getWorkspaceTimesheets = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { status, startDate, endDate, memberId } = req.query;
        const userId = req.userId;

        const workspace = await WorkspaceModel.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace không tồn tại" });
        }

        const user = await UserModel.findById(userId).populate('roleId');
        const isAdmin = user && user.roleId && user.roleId.name === 'Admin';

        // Check if PM or Admin
        if (!isAdmin && workspace.leader.toString() !== userId) {
            return res.status(403).json({ message: "Chỉ Leader hoặc Admin mới xem được toàn bộ Timesheet của dự án" });
        }

        let filter = { workspaceId };
        
        if (status) filter.status = status;
        if (memberId) filter.userId = memberId;
        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const timesheets = await TimesheetModel.find(filter)
            .populate("userId", "fullName email")
            .populate("taskId", "title status")
            .sort({ date: -1, startTime: -1 });

        res.status(200).json({
            message: "Lấy danh sách timesheet dự án thành công",
            data: timesheets
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
};

// PM: Approve or Reject a timesheet
export const updateTimesheetStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, pmComment } = req.body;
        const userId = req.userId;

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ (Approved hoặc Rejected)" });
        }

        if (status === 'Rejected' && !pmComment) {
            return res.status(400).json({ message: "Vui lòng nhập lý do (pmComment) khi Reject" });
        }

        const timesheet = await TimesheetModel.findById(id).populate('workspaceId');
        if (!timesheet) {
            return res.status(404).json({ message: "Không tìm thấy timesheet" });
        }

        const workspace = timesheet.workspaceId;
        if (workspace.leader.toString() !== userId) {
            return res.status(403).json({ message: "Bạn không có quyền duyệt timesheet này" });
        }

        timesheet.status = status;
        if (status === 'Rejected') {
            timesheet.pmComment = pmComment;
        } else {
            timesheet.pmComment = ''; // Clear comment if approved
        }

        await timesheet.save();

        res.status(200).json({
            message: `Timesheet đã được ${status}`,
            data: timesheet
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
};

// Admin: Get all timesheets across all workspaces
export const getAllTimesheets = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await UserModel.findById(userId).populate('roleId');
        
        if (!user || !user.roleId || user.roleId.name !== 'Admin') {
            return res.status(403).json({ message: "Chỉ Admin mới có quyền truy cập" });
        }

        const timesheets = await TimesheetModel.find()
            .populate("userId", "fullName email")
            .populate("workspaceId", "name")
            .populate("taskId", "title")
            .sort({ date: -1 });

        res.status(200).json({
            message: "Lấy danh sách timesheet toàn hệ thống thành công",
            data: timesheets
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
};
