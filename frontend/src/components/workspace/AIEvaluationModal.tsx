import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, RefreshCw, User } from 'lucide-react';
import { evaluateWorkspaceAI, type AIEvaluation } from '../../services/ai';

interface AIEvaluationModalProps {
    isOpen: boolean;
    onClose: () => void;
    workspaceId: string;
}

export const AIEvaluationModal: React.FC<AIEvaluationModalProps> = ({ isOpen, onClose, workspaceId }) => {
    const [evaluation, setEvaluation] = useState<AIEvaluation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEvaluate = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await evaluateWorkspaceAI(workspaceId);
            setEvaluation(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi gọi AI');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1a2f2a] w-full max-w-4xl max-h-[90vh] rounded-3xl border border-teal-800/50 flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-teal-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
                            <Sparkles size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Gemini AI Assistant</h2>
                    </div>
                    <button 
                        onClick={() => {
                            // Reset state on close
                            setEvaluation(null);
                            setError('');
                            onClose();
                        }}
                        className="text-teal-200/60 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
                            <AlertCircle size={20} />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-between items-center bg-[#0f1f1b] p-4 rounded-xl border border-teal-800/30">
                        <div>
                            <h3 className="text-white font-semibold">Đánh giá Hiệu suất Dự án</h3>
                            <p className="text-teal-200/60 text-sm mt-1">AI sẽ phân tích các Task và Timesheet để đưa ra báo cáo tổng quan.</p>
                        </div>
                        <button
                            onClick={handleEvaluate}
                            disabled={loading}
                            className="bg-teal-500 text-[#0f1f1b] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-teal-400 transition-colors disabled:opacity-50"
                        >
                            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                            {loading ? 'Đang phân tích...' : 'Bắt đầu Phân tích'}
                        </button>
                    </div>

                    {loading ? (
                        <div className="py-20 text-center flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-t-transparent border-teal-500 mb-6"></div>
                            <p className="text-teal-200/60 font-medium text-lg animate-pulse">Gemini đang phân tích dữ liệu...</p>
                        </div>
                    ) : evaluation ? (
                        <div className="bg-[#0f1f1b] p-6 rounded-2xl border border-teal-800/50">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-teal-800/30">
                                <span className="text-teal-400 font-semibold flex items-center gap-2">
                                    Báo cáo Đánh giá Mới nhất
                                </span>
                                <span className="text-teal-200/40 text-sm">
                                    {new Date(evaluation.createdAt).toLocaleString()}
                                </span>
                            </div>
                            
                            <div className="mb-6">
                                <div className="inline-block bg-teal-500/10 border border-teal-500/20 px-4 py-2 rounded-lg">
                                    <span className="text-teal-200/60 text-sm">Điểm Hiệu Suất: </span>
                                    <span className="text-teal-400 font-bold text-xl">{evaluation.overallScore}/10</span>
                                </div>
                            </div>

                            <div className="space-y-6 text-sm text-teal-100">
                                <div>
                                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                                        Chất lượng công việc
                                    </h4>
                                    <p className="leading-relaxed whitespace-pre-wrap pl-3 border-l border-teal-800/50">
                                        {evaluation.qualityAnalysis}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                                        Hiệu suất thời gian
                                    </h4>
                                    <p className="leading-relaxed whitespace-pre-wrap pl-3 border-l border-teal-800/50">
                                        {evaluation.performanceAnalysis}
                                    </p>
                                </div>

                                <div className="bg-teal-900/20 p-4 rounded-xl border border-teal-800/30">
                                    <h4 className="text-teal-400 font-semibold mb-2">Đề xuất cải thiện chung</h4>
                                    <p className="leading-relaxed whitespace-pre-wrap">
                                        {evaluation.recommendations}
                                    </p>
                                </div>

                                {evaluation.memberEvaluations && evaluation.memberEvaluations.length > 0 && (
                                    <div className="mt-8 pt-6 border-t border-teal-800/50">
                                        <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                            <User size={18} className="text-teal-400" /> Đánh giá từng cá nhân
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {evaluation.memberEvaluations.map((member, mIndex) => (
                                                <div key={mIndex} className="bg-[#1a2f2a] p-4 rounded-xl border border-teal-800/50 hover:border-teal-400/30 transition-colors">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-bold text-teal-200">{member.memberName}</span>
                                                        <span className="bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded text-xs font-bold border border-teal-500/30">
                                                            Điểm: {member.score}/10
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-teal-100/80 leading-relaxed whitespace-pre-wrap">
                                                        {member.feedback}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 text-center flex flex-col items-center">
                            <Sparkles size={48} className="text-teal-800 mb-4" />
                            <p className="text-teal-200/40 text-lg">Bấm "Bắt đầu Phân tích" để AI tiến hành đánh giá dự án của bạn.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
