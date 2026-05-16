import TaskModel from "../model/TaskModel.js";

// lấy tất cả công việc
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await TaskModel.find().sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách công việc", error });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await TaskModel.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Không tìm thấy công việc" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy công việc", error });
    }
}

// tạo công việc mới
export const createTask = async (req, res) => {

    const newTask = new TaskModel({
        title: req.body.title,
        description: req.body.description,
        userId: req.userId,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        startDate: req.body.startDate,
        tags: req.body.tags
    });

    try {
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo công việc", error });
    }
};

// cập nhật công việc
export const updateTask = async (req, res) => {
    try {
        const updatedData = {};

        if (req.body.title !== undefined) updatedData.title = req.body.title;
        if (req.body.description !== undefined) updatedData.description = req.body.description;
        if (req.body.status !== undefined) updatedData.status = req.body.status;

        const task = await TaskModel.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ message: "Không tìm thấy công việc" });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi cập nhật công việc",
            error: error.message
        });
    }
};