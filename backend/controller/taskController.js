import TaskModel from "../model/TaskModel.js";
import { WorkspaceModel } from "../model/WorkspaceModel.js";
import { TimesheetModel } from "../model/TimesheetModel.js";
import { TaskChangeRequestModel } from "../model/TaskChangeRequestModel.js";
import { checkIsWorkspaceLeader } from "../utils/roleHelper.js";

export const getAllTasks = async (req, res) => {
    try {
        const { assignee } = req.query;
        const userWorkspaces = await WorkspaceModel.find({
            $or: [{ leader: req.userId }, { members: req.userId }]
        });
        const workspaceIds = userWorkspaces.map(ws => ws._id);

        let filter = { workspaceId: { $in: workspaceIds } };
        if (assignee === 'me') {
            filter.assigneeId = req.userId;
        }

        const tasks = await TaskModel.find(filter)
        .populate('workspaceId', 'name')
        .populate('assigneeId', 'fullName email')
        .populate('editHistory.updatedBy', 'fullName email')
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
            .populate('assigneeId', 'fullName email')
            .populate('editHistory.updatedBy', 'fullName email')
            .sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách công việc của workspace", error: error.message });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await TaskModel.findById(req.params.id)
            .populate('workspaceId', 'name')
            .populate('assigneeId', 'fullName email')
            .populate('editHistory.updatedBy', 'fullName email');
        if (!task) {
            return res.status(404).json({ message: "Không tìm thấy công việc" });
        }

        const workspace = await WorkspaceModel.findOne({
            _id: task.workspaceId._id || task.workspaceId,
            $or: [{ leader: req.userId }, { members: req.userId }]
        });

        if (!workspace) {
            return res.status(403).json({ message: "Bạn không có quyền xem công việc này" });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy công việc", error: error.message });
    }
}

// tạo công việc mới
export const createTask = async (req, res) => {
    try {
        const { workspaceId, title, description, priority, dueDate, startDate, tags, assigneeId, sprintId, estimatedHours, taskType } = req.body;

        if (!workspaceId) {
            return res.status(400).json({ message: "workspaceId là bắt buộc" });
        }

        const workspace = await WorkspaceModel.findOne({
            _id: workspaceId,
            $or: [{ leader: req.userId }, { members: req.userId }]
        });

        if (!workspace) {
            return res.status(403).json({ message: "Bạn không có quyền tạo công việc trong workspace này" });
        }

        const isLeader = await checkIsWorkspaceLeader(workspaceId, req.userId);
        
        let finalTaskType = taskType || 'Planned';
        if (!isLeader) {
            const allowedUnplannedTypes = ['Sub-task', 'Bug Fixing', 'Ad-hoc'];
            if (!allowedUnplannedTypes.includes(finalTaskType)) {
                return res.status(400).json({ message: "Thành viên chỉ được tạo task phát sinh (Sub-task, Bug Fixing, Ad-hoc)" });
            }
        }

        const newTask = new TaskModel({
            title,
            description,
            creatorId: req.userId,
            workspaceId,
            sprintId: sprintId || null,
            priority,
            estimatedHours,
            taskType: finalTaskType,
            dueDate,
            startDate,
            tags,
            assigneeId: assigneeId || null
        });

        const savedTask = await newTask.save();
        const taskObj = savedTask.toObject();
        const { _id, ...rest } = taskObj;
        
        res.status(201).json({ _id, ...rest });
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

        const workspace = await WorkspaceModel.findOne({
            _id: task.workspaceId,
            $or: [{ leader: req.userId }, { members: req.userId }]
        });

        if (!workspace) {
            return res.status(403).json({ message: "Bạn không có quyền truy cập công việc này" });
        }

        const isLeader = await checkIsWorkspaceLeader(workspace._id, req.userId);
        const isAssignee = task.assigneeId && task.assigneeId.toString() === req.userId;
        const isCreator = task.creatorId && task.creatorId.toString() === req.userId;

        if (!isAssignee && !isCreator && !isLeader) {
            return res.status(403).json({ message: "Chỉ người được giao việc hoặc Quản lý dự án mới có quyền cập nhật công việc này" });
        }

        const updatedData = {};
        const fieldsChanged = [];
        const timeChanges = {};
        
        // Check if task has any timesheets logged
        const timesheetCount = await TimesheetModel.countDocuments({ taskId: task._id });
        const hasTimesheets = timesheetCount > 0;

        const checkAndAdd = (field, newValue, oldVal) => {
            if (newValue !== undefined && newValue !== oldVal && String(newValue) !== String(oldVal)) {
                updatedData[field] = newValue;
                fieldsChanged.push(field);
            }
        };

        const checkTimeChange = (field, newValue, oldVal) => {
            if (newValue !== undefined && newValue !== oldVal && String(newValue) !== String(oldVal)) {
                // If has timesheets and not PM, it must be approved
                if (hasTimesheets && !isLeader) {
                    timeChanges[field] = { old: oldVal, new: newValue };
                } else {
                    updatedData[field] = newValue;
                    fieldsChanged.push(field);
                }
            }
        };

        checkAndAdd('title', req.body.title, task.title);
        checkAndAdd('description', req.body.description, task.description);
        checkAndAdd('status', req.body.status, task.status);
        checkAndAdd('position', req.body.position, task.position);
        checkAndAdd('priority', req.body.priority, task.priority);
        checkAndAdd('tags', req.body.tags, task.tags);
        checkAndAdd('assigneeId', req.body.assigneeId, task.assigneeId);
        checkAndAdd('sprintId', req.body.sprintId, task.sprintId);
        checkAndAdd('taskType', req.body.taskType, task.taskType);

        checkTimeChange('estimatedHours', req.body.estimatedHours, task.estimatedHours);
        
        // Handle dates properly
        if (req.body.startDate !== undefined) {
            const newStartDate = req.body.startDate ? new Date(req.body.startDate).toISOString() : null;
            const oldStartDate = task.startDate ? new Date(task.startDate).toISOString() : null;
            checkTimeChange('startDate', req.body.startDate, oldStartDate);
        }
        
        if (req.body.dueDate !== undefined) {
            const newDueDate = req.body.dueDate ? new Date(req.body.dueDate).toISOString() : null;
            const oldDueDate = task.dueDate ? new Date(task.dueDate).toISOString() : null;
            checkTimeChange('dueDate', req.body.dueDate, oldDueDate);
        }

        if (Object.keys(timeChanges).length > 0) {
            const newRequest = new TaskChangeRequestModel({
                taskId: task._id,
                workspaceId: task.workspaceId,
                requestedBy: req.userId,
                changes: timeChanges
            });
            await newRequest.save();
        }

        let note = "Cập nhật công việc";
        if (Object.keys(timeChanges).length > 0) {
            note += ". Đã gửi yêu cầu thay đổi thời gian chờ duyệt.";
            // Add time fields to history too, even though they are pending
            fieldsChanged.push(...Object.keys(timeChanges));
        }

        // Only update if there are changes
        if (fieldsChanged.length > 0) {
            const newHistory = {
                updatedBy: req.userId,
                fieldsChanged: fieldsChanged,
                note: note
            };

            const updatedTask = await TaskModel.findByIdAndUpdate(
                req.params.id,
                { 
                    $set: updatedData,
                    $push: { editHistory: newHistory }
                },
                { new: true, runValidators: true }
            );
            return res.status(200).json(updatedTask);
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi cập nhật công việc",
            error: error.message
        });
    }
};

export const pauseTask = async (req, res) => {
    try {
        const task = await TaskModel.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Không tìm thấy công việc" });

        const isLeader = await checkIsWorkspaceLeader(task.workspaceId, req.userId);
        if (!isLeader) return res.status(403).json({ message: "Chỉ PM mới có quyền tạm dừng công việc" });

        task.isPaused = !task.isPaused;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạm dừng công việc", error: error.message });
    }
};

export const cancelTask = async (req, res) => {
    try {
        const task = await TaskModel.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Không tìm thấy công việc" });

        const isLeader = await checkIsWorkspaceLeader(task.workspaceId, req.userId);
        if (!isLeader) return res.status(403).json({ message: "Chỉ PM mới có quyền hủy công việc" });

        task.isCancelled = !task.isCancelled;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi hủy công việc", error: error.message });
    }
};