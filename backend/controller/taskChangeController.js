import { TaskChangeRequestModel } from "../model/TaskChangeRequestModel.js";
import TaskModel from "../model/TaskModel.js";
import { checkIsWorkspaceLeader } from "../utils/roleHelper.js";

// Lấy danh sách các yêu cầu đang chờ duyệt cho các dự án mà PM quản lý
export const getPendingRequests = async (req, res) => {
    try {
        const userId = req.userId;
        // Chúng ta có thể lấy danh sách các workspaceId mà user làm leader
        // Tạm thời PMDashboard sẽ gọi qua dashboardController
        res.status(200).json({ message: "Not implemented here, use dashboard API" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const approveRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await TaskChangeRequestModel.findById(requestId);
        
        if (!request) return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
        if (request.status !== 'Pending') return res.status(400).json({ message: "Yêu cầu này đã được xử lý" });

        const isLeader = await checkIsWorkspaceLeader(request.workspaceId, req.userId);
        if (!isLeader) return res.status(403).json({ message: "Bạn không có quyền duyệt yêu cầu này" });

        const task = await TaskModel.findById(request.taskId);
        if (!task) return res.status(404).json({ message: "Task không tồn tại" });

        // Cập nhật các trường thời gian
        const changes = request.changes;
        const fieldsChanged = [];
        
        if (changes.estimatedHours && changes.estimatedHours.new !== undefined) {
            task.estimatedHours = changes.estimatedHours.new;
            fieldsChanged.push('estimatedHours (Đã duyệt)');
        }
        if (changes.startDate && changes.startDate.new !== undefined) {
            task.startDate = changes.startDate.new;
            fieldsChanged.push('startDate (Đã duyệt)');
        }
        if (changes.dueDate && changes.dueDate.new !== undefined) {
            task.dueDate = changes.dueDate.new;
            fieldsChanged.push('dueDate (Đã duyệt)');
        }

        // Lưu lịch sử
        if (fieldsChanged.length > 0) {
            task.editHistory.push({
                updatedBy: req.userId,
                fieldsChanged,
                note: "PM đã duyệt thay đổi thời gian từ Assignee."
            });
        }

        await task.save();

        request.status = 'Approved';
        request.reviewedBy = req.userId;
        request.reviewedAt = new Date();
        await request.save();

        res.status(200).json({ message: "Đã duyệt yêu cầu", task });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

export const rejectRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await TaskChangeRequestModel.findById(requestId);
        
        if (!request) return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
        if (request.status !== 'Pending') return res.status(400).json({ message: "Yêu cầu này đã được xử lý" });

        const isLeader = await checkIsWorkspaceLeader(request.workspaceId, req.userId);
        if (!isLeader) return res.status(403).json({ message: "Bạn không có quyền từ chối yêu cầu này" });

        request.status = 'Rejected';
        request.reviewedBy = req.userId;
        request.reviewedAt = new Date();
        await request.save();

        // Ghi lại lịch sử từ chối
        const task = await TaskModel.findById(request.taskId);
        if (task) {
            task.editHistory.push({
                updatedBy: req.userId,
                fieldsChanged: [],
                note: "PM đã từ chối yêu cầu thay đổi thời gian."
            });
            await task.save();
        }

        res.status(200).json({ message: "Đã từ chối yêu cầu" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
