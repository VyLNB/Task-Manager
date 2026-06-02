import TaskModel from "../model/TaskModel.js";
import { WorkspaceModel } from "../model/WorkspaceModel.js";

// lấy tất cả công việc
export const getAllTasks = async (req, res) => {
    try {
        const userWorkspaces = await WorkspaceModel.find({
            $or: [{ leader: req.userId }, { members: req.userId }]
        });
        const workspaceIds = userWorkspaces.map(ws => ws._id);

        const tasks = await TaskModel.find({
            $or: [
                { workspaceId: { $in: workspaceIds } },
                { workspaceId: null, creatorId: req.userId }
            ]
        })
        .populate('workspaceId', 'name')
        .sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách công việc", error: error.message });
    }
};

export const getTasksByWorkspace = async (req, res) => {
    try {
        const workspaceId = req.params.workspaceId;
        const workspace = await WorkspaceModel.findOne({
            _id: workspaceId,
            $or: [{ leader: req.userId }, { members: req.userId }]
        });

        if (!workspace) {
            return res.status(403).json({ message: "Bạn không có quyền truy cập workspace này hoặc workspace không tồn tại" });
        }

        const tasks = await TaskModel.find({ workspaceId })
            .populate('workspaceId', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách công việc của workspace", error: error.message });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await TaskModel.findById(req.params.id).populate('workspaceId', 'name');
        if (!task) {
            return res.status(404).json({ message: "Không tìm thấy công việc" });
        }

        if (task.workspaceId) {
            const workspace = await WorkspaceModel.findOne({
                _id: task.workspaceId._id || task.workspaceId,
                $or: [{ leader: req.userId }, { members: req.userId }]
            });

            if (!workspace) {
                return res.status(403).json({ message: "Bạn không có quyền xem công việc này" });
            }
        } else {
            // Task cá nhân
            if (task.creatorId.toString() !== req.userId) {
                return res.status(403).json({ message: "Bạn không có quyền xem công việc cá nhân này" });
            }
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy công việc", error: error.message });
    }
}

// tạo công việc mới
export const createTask = async (req, res) => {
    try {
        const { workspaceId, title, description, priority, dueDate, startDate, tags } = req.body;

        if (workspaceId) {
            const workspace = await WorkspaceModel.findOne({
                _id: workspaceId,
                $or: [{ leader: req.userId }, { members: req.userId }]
            });

            if (!workspace) {
                return res.status(403).json({ message: "Bạn không có quyền tạo công việc trong workspace này" });
            }
        }

        const newTask = new TaskModel({
            title,
            description,
            creatorId: req.userId,
            workspaceId: workspaceId || null,
            priority,
            dueDate,
            startDate,
            tags
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo công việc", error: error.message });
    }
};

// cập nhật công việc
export const updateTask = async (req, res) => {
    try {
        const task = await TaskModel.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Không tìm thấy công việc" });
        }

        if (task.workspaceId) {
            const workspace = await WorkspaceModel.findOne({
                _id: task.workspaceId,
                $or: [{ leader: req.userId }, { members: req.userId }]
            });

            if (!workspace) {
                return res.status(403).json({ message: "Bạn không có quyền cập nhật công việc này" });
            }
        } else {
            // Task cá nhân
            if (task.creatorId.toString() !== req.userId) {
                return res.status(403).json({ message: "Bạn không có quyền cập nhật công việc cá nhân này" });
            }
        }

        const updatedData = {};

        if (req.body.title !== undefined) updatedData.title = req.body.title;
        if (req.body.description !== undefined) updatedData.description = req.body.description;
        if (req.body.status !== undefined) updatedData.status = req.body.status;
        if (req.body.position !== undefined) updatedData.position = req.body.position;
        if (req.body.priority !== undefined) updatedData.priority = req.body.priority;
        if (req.body.dueDate !== undefined) updatedData.dueDate = req.body.dueDate;
        if (req.body.startDate !== undefined) updatedData.startDate = req.body.startDate;
        if (req.body.tags !== undefined) updatedData.tags = req.body.tags;
        if (req.body.assigneeId !== undefined) updatedData.assigneeId = req.body.assigneeId;

        const updatedTask = await TaskModel.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi cập nhật công việc",
            error: error.message
        });
    }
};