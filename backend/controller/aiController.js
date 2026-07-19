import { GoogleGenAI } from '@google/genai';
import TaskModel from '../model/TaskModel.js';
import { TimesheetModel } from '../model/TimesheetModel.js';
import { WorkspaceModel } from '../model/WorkspaceModel.js';
import { AIEvaluationModel } from '../model/AIEvaluationModel.js';

export const evaluateWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const userId = req.userId; // User requesting the evaluation

        // Verify workspace exists
        const workspace = await WorkspaceModel.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Không tìm thấy dự án." });
        }

        // Fetch Tasks and Timesheets
        const tasks = await TaskModel.find({ workspaceId }).populate('assigneeId', 'name').select('title status estimatedHours taskType priority assigneeId');
        const timesheets = await TimesheetModel.find({ workspaceId }).populate('userId', 'name').select('taskId hours description result status date userId');

        if (tasks.length === 0) {
            return res.status(400).json({ message: "Dự án chưa có công việc nào để đánh giá." });
        }

        // Aggregate Data for Prompt
        const dataForAI = tasks.map(task => {
            const relatedTimesheets = timesheets.filter(ts => ts.taskId.toString() === task._id.toString());
            const totalActualHours = relatedTimesheets.reduce((sum, ts) => sum + ts.hours, 0);
            
            return {
                taskTitle: task.title,
                taskType: task.taskType,
                status: task.status,
                priority: task.priority,
                estimatedHours: task.estimatedHours || 0,
                assignee: task.assigneeId ? task.assigneeId.name : 'Chưa phân công',
                totalActualHours: totalActualHours,
                timesheetDetails: relatedTimesheets.map(ts => ({
                    date: ts.date,
                    memberName: ts.userId ? ts.userId.name : 'Unknown',
                    hours: ts.hours,
                    description: ts.description,
                    result: ts.result,
                    status: ts.status
                }))
            };
        });

        // Setup Gemini
        if (!process.env.GEMINI_API_KEY) {
             return res.status(500).json({ message: "Thiếu cấu hình GEMINI_API_KEY trong file .env." });
        }
        
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `
        Bạn là một Quản lý Dự án (Project Manager) giàu kinh nghiệm. Dưới đây là dữ liệu về các công việc (tasks) và nhật ký làm việc (timesheets) của một dự án.
        Nhiệm vụ của bạn là đánh giá hiệu suất tổng quan của dự án và ĐÁNH GIÁ CHI TIẾT TỪNG THÀNH VIÊN dựa trên dữ liệu này. Trả về kết quả dưới dạng JSON hợp lệ (không chứa block markdown) với cấu trúc sau:
        {
            "overallScore": 8.5,
            "qualityAnalysis": "Phân tích chất lượng công việc tổng quan...",
            "performanceAnalysis": "Phân tích hiệu suất thời gian tổng quan...",
            "recommendations": "Đề xuất cải thiện chung...",
            "memberEvaluations": [
                {
                    "memberName": "Tên thành viên",
                    "score": 8,
                    "feedback": "Nhận xét chi tiết về hiệu suất, chất lượng và thời gian hoàn thành công việc của thành viên này."
                }
            ]
        }

        Dữ liệu Dự án:
        Tên dự án: ${workspace.name}
        Chi tiết:
        ${JSON.stringify(dataForAI, null, 2)}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const resultText = response.text;
        let evaluationResult;
        try {
            evaluationResult = JSON.parse(resultText);
        } catch (e) {
            console.error("Lỗi parse JSON từ AI:", resultText);
            return res.status(500).json({ message: "Lỗi xử lý kết quả từ AI." });
        }

        // Save to Database
        const newEvaluation = new AIEvaluationModel({
            workspaceId,
            overallScore: evaluationResult.overallScore,
            qualityAnalysis: evaluationResult.qualityAnalysis,
            performanceAnalysis: evaluationResult.performanceAnalysis,
            recommendations: evaluationResult.recommendations,
            memberEvaluations: evaluationResult.memberEvaluations || [],
            createdBy: userId
        });

        await newEvaluation.save();

        res.status(200).json({
            message: "Đánh giá bằng AI thành công",
            data: newEvaluation
        });

    } catch (error) {
        console.error("Lỗi trong evaluateWorkspace:", error);
        res.status(500).json({ message: "Có lỗi xảy ra khi đánh giá bằng AI." });
    }
};

export const getEvaluationHistory = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const evaluations = await AIEvaluationModel.find({ workspaceId }).sort({ createdAt: -1 });
        
        res.status(200).json({
            message: "Lấy lịch sử đánh giá thành công",
            data: evaluations
        });
    } catch (error) {
        console.error("Lỗi lấy lịch sử đánh giá:", error);
        res.status(500).json({ message: "Có lỗi xảy ra khi lấy dữ liệu." });
    }
};

export const getMyEvaluations = async (req, res) => {
    try {
        const userId = req.userId;

        // Tìm tất cả Workspace mà user là leader hoặc member
        const workspaces = await WorkspaceModel.find({
            $or: [{ leader: userId }, { members: userId }]
        }).select('_id');

        const workspaceIds = workspaces.map(ws => ws._id);

        // Lấy tất cả Đánh giá của các Workspace đó, gộp tên Workspace và Leader
        const evaluations = await AIEvaluationModel.find({
            workspaceId: { $in: workspaceIds }
        })
        .populate({
            path: 'workspaceId',
            select: 'name leader',
            populate: {
                path: 'leader',
                select: 'fullName email'
            }
        })
        .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Lấy danh sách đánh giá thành công",
            data: evaluations
        });
    } catch (error) {
        console.error("Lỗi lấy lịch sử đánh giá cá nhân:", error);
        res.status(500).json({ message: "Có lỗi xảy ra khi lấy dữ liệu." });
    }
};
