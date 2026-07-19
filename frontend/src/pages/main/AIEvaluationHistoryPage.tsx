import React, { useEffect, useState } from 'react';
import { getMyEvaluationHistory, type PopulatedAIEvaluation } from '../../services/ai';
import { Sparkles, Calendar, User, Eye, X, Award } from 'lucide-react';

const AIEvaluationHistoryPage = () => {
    const [evaluations, setEvaluations] = useState<PopulatedAIEvaluation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedEval, setSelectedEval] = useState<PopulatedAIEvaluation | null>(null);

    useEffect(() => {
        const fetchEvaluations = async () => {
            try {
                setLoading(true);
                const data = await getMyEvaluationHistory();
                setEvaluations(data);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || 'Không thể tải lịch sử đánh giá');
            } finally {
                setLoading(false);
            }
        };
        fetchEvaluations();
    }, []);

    return (
        <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-white flex items-center gap-4 mb-2">
                    <Sparkles className="text-teal-400" size={36} />
                    Lịch sử Đánh giá AI
                </h1>
                <p className="text-teal-200/60 text-lg ml-12">
                    Xem lại toàn bộ các báo cáo phân tích hiệu suất từ Gemini AI cho các dự án của bạn.
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl mb-8 border border-red-500/20 font-medium">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="py-20 text-center flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-t-transparent border-teal-500 mb-6"></div>
                    <p className="text-teal-200/60 font-medium text-lg animate-pulse">Đang tải lịch sử...</p>
                </div>
            ) : evaluations.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center bg-[#1a2f2a] rounded-3xl border border-teal-800/50 shadow-xl">
                    <Sparkles size={48} className="text-teal-800 mb-4" />
                    <p className="text-teal-200/40 text-lg">Chưa có bài đánh giá AI nào trong các dự án của bạn.</p>
                </div>
            ) : (
                <div className="bg-[#1a2f2a] rounded-3xl border border-teal-800/50 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-teal-900/30 border-b border-teal-800/50">
                                    <th className="p-5 text-teal-400 font-semibold text-sm uppercase tracking-wider">Dự án</th>
                                    <th className="p-5 text-teal-400 font-semibold text-sm uppercase tracking-wider">Ngày đánh giá</th>
                                    <th className="p-5 text-teal-400 font-semibold text-sm uppercase tracking-wider">PM</th>
                                    <th className="p-5 text-teal-400 font-semibold text-sm uppercase tracking-wider">Hiệu suất</th>
                                    <th className="p-5 text-teal-400 font-semibold text-sm uppercase tracking-wider text-center">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-teal-800/50">
                                {evaluations.map((ev) => (
                                    <tr key={ev._id} className="hover:bg-teal-800/30 transition-colors">
                                        <td className="p-5 text-white font-medium">
                                            {ev.workspaceId?.name || 'Dự án đã xóa'}
                                        </td>
                                        <td className="p-5 text-teal-200/60">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} />
                                                {new Date(ev.createdAt).toLocaleString('vi-VN')}
                                            </div>
                                        </td>
                                        <td className="p-5 text-teal-200/60">
                                            <div className="flex items-center gap-2">
                                                <User size={16} />
                                                {ev.workspaceId?.leader?.fullName || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full font-bold text-sm border border-teal-500/30">
                                                <Award size={14} />
                                                {ev.overallScore}/10
                                            </div>
                                        </td>
                                        <td className="p-5 text-center">
                                            <button 
                                                onClick={() => setSelectedEval(ev)}
                                                className="p-2 text-teal-300 hover:bg-teal-500/20 hover:text-white rounded-lg transition-colors inline-block"
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal Detail */}
            {selectedEval && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a2f2a] w-full max-w-4xl max-h-[90vh] rounded-3xl border border-teal-800/50 flex flex-col shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-teal-800/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Chi tiết Báo cáo AI</h2>
                                    <p className="text-teal-200/60 text-sm">Dự án: {selectedEval.workspaceId?.name || 'N/A'}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedEval(null)}
                                className="text-teal-200/60 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            <div className="mb-6">
                                <div className="inline-block bg-teal-500/10 border border-teal-500/20 px-4 py-2 rounded-lg">
                                    <span className="text-teal-200/60 text-sm">Điểm Hiệu Suất: </span>
                                    <span className="text-teal-400 font-bold text-xl">{selectedEval.overallScore}/10</span>
                                </div>
                            </div>

                            <div className="space-y-6 text-sm text-teal-100">
                                <div>
                                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                                        Chất lượng công việc
                                    </h4>
                                    <p className="leading-relaxed whitespace-pre-wrap pl-3 border-l border-teal-800/50">
                                        {selectedEval.qualityAnalysis}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                                        Hiệu suất thời gian
                                    </h4>
                                    <p className="leading-relaxed whitespace-pre-wrap pl-3 border-l border-teal-800/50">
                                        {selectedEval.performanceAnalysis}
                                    </p>
                                </div>

                                <div className="bg-teal-900/20 p-4 rounded-xl border border-teal-800/30">
                                    <h4 className="text-teal-400 font-semibold mb-2">Đề xuất cải thiện chung</h4>
                                    <p className="leading-relaxed whitespace-pre-wrap">
                                        {selectedEval.recommendations}
                                    </p>
                                </div>

                                {selectedEval.memberEvaluations && selectedEval.memberEvaluations.length > 0 && (
                                    <div className="mt-8 pt-6 border-t border-teal-800/50">
                                        <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                            <User size={18} className="text-teal-400" /> Đánh giá từng cá nhân
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedEval.memberEvaluations.map((member, mIndex) => (
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIEvaluationHistoryPage;
