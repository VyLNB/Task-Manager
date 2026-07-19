import mongoose from "mongoose";

const AIEvaluationSchema = new mongoose.Schema(
    {
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'workspaces',
            required: true
        },
        evaluationDate: {
            type: Date,
            default: Date.now
        },
        overallScore: {
            type: Number,
            required: false,
            description: "Điểm đánh giá hiệu suất tổng quan (1-10)"
        },
        qualityAnalysis: {
            type: String,
            required: true,
            description: "Phân tích chất lượng công việc từ AI"
        },
        performanceAnalysis: {
            type: String,
            required: true,
            description: "Phân tích hiệu suất thời gian (dự kiến vs thực tế)"
        },
        recommendations: {
            type: String,
            required: true,
            description: "Đề xuất cải thiện từ AI"
        },
        memberEvaluations: [{
            memberName: String,
            score: Number,
            feedback: String
        }],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
            description: "Người yêu cầu AI đánh giá"
        }
    },
    { timestamps: true }
);

AIEvaluationSchema.index({ workspaceId: 1 });

export const AIEvaluationModel = mongoose.model('ai_evaluations', AIEvaluationSchema, 'ai_evaluations');
