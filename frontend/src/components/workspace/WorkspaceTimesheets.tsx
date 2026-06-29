import React, { useEffect, useState } from 'react';
import { getWorkspaceTimesheets, updateTimesheetStatus } from '../../services/timesheet';
import type { TimesheetInterface } from '../../interfaces/timesheet';
import { Check, X, MessageSquare, Loader2, Clock } from 'lucide-react';

interface WorkspaceTimesheetsProps {
    workspaceId: string;
    isAdminView?: boolean;
}

export const WorkspaceTimesheets: React.FC<WorkspaceTimesheetsProps> = ({ workspaceId, isAdminView }) => {
    const [timesheets, setTimesheets] = useState<TimesheetInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectComment, setRejectComment] = useState('');

    const fetchTimesheets = async () => {
        try {
            setLoading(true);
            const res = await getWorkspaceTimesheets(workspaceId);
            setTimesheets(res.data || []);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải danh sách timesheet');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (workspaceId) fetchTimesheets();
    }, [workspaceId]);

    const handleStatusChange = async (id: string, status: 'Approved' | 'Rejected', pmComment?: string) => {
        try {
            await updateTimesheetStatus(id, status, pmComment);
            setTimesheets(timesheets.map(t => 
                t._id === id ? { ...t, status, pmComment } : t
            ));
            if (status === 'Rejected') {
                setRejectingId(null);
                setRejectComment('');
            }
        } catch (err: any) {
            alert(err.message || 'Lỗi khi cập nhật trạng thái');
        }
    };

    if (loading) {
        return (
            <div className="py-20 flex justify-center text-teal-500">
                <Loader2 className="w-10 h-10 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20 font-medium">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-[#1a2f2a]/60 border border-teal-800/50 rounded-2xl overflow-hidden shadow-xl mt-6">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-teal-800/50 bg-[#0f1f1b]/50">
                            <th className="p-4 text-teal-200/60 font-bold text-sm uppercase">Thành viên</th>
                            <th className="p-4 text-teal-200/60 font-bold text-sm uppercase">Ngày & Giờ</th>
                            <th className="p-4 text-teal-200/60 font-bold text-sm uppercase">Công việc</th>
                            <th className="p-4 text-teal-200/60 font-bold text-sm uppercase">Chi tiết</th>
                            {!isAdminView && <th className="p-4 text-teal-200/60 font-bold text-sm uppercase text-center">Kiểm duyệt</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {timesheets.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-teal-200/50">
                                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    Chưa có ai log time trong dự án này.
                                </td>
                            </tr>
                        ) : timesheets.map((t) => (
                            <tr key={t._id} className="border-b border-teal-800/30 hover:bg-[#0f1f1b]/30 transition-colors">
                                <td className="p-4 align-top">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center font-bold text-xs text-white">
                                            {t.userId?.fullName?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{t.userId?.fullName}</p>
                                            <p className="text-teal-200/50 text-xs">{t.userId?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 align-top">
                                    <div className="text-white font-medium mb-1">
                                        {new Date(t.date).toLocaleDateString('vi-VN')}
                                    </div>
                                    <div className="text-xs text-teal-400 font-mono bg-teal-900/30 px-2 py-0.5 rounded w-fit mb-1">
                                        {t.startTime} - {t.endTime}
                                    </div>
                                    <div className="text-xs text-amber-400 font-bold">
                                        Tổng: {t.hours}h
                                    </div>
                                </td>
                                <td className="p-4 align-top">
                                    <p className="text-teal-100 font-semibold line-clamp-2">{t.taskId?.title || 'Unknown Task'}</p>
                                    <p className="text-xs text-teal-200/50 mt-1">Status: {t.taskId?.status}</p>
                                </td>
                                <td className="p-4 align-top">
                                    <div className="text-sm text-gray-300 mb-1 line-clamp-2">{t.description}</div>
                                    {t.result && (
                                        <div className="text-xs text-teal-200/70 truncate bg-teal-900/20 px-2 py-1 rounded mt-1">
                                            <span className="font-semibold">KQ:</span> {t.result}
                                        </div>
                                    )}
                                </td>
                                {!isAdminView && (
                                    <td className="p-4 align-top">
                                    {t.status === 'Approved' ? (
                                        <div className="flex justify-center">
                                            <span className="bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                                                <Check size={14} /> Đã Duyệt
                                            </span>
                                        </div>
                                    ) : t.status === 'Rejected' ? (
                                        <div className="flex flex-col items-center">
                                            <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 mb-1">
                                                <X size={14} /> Đã Từ Chối
                                            </span>
                                            <span className="text-[10px] text-red-400/70 bg-red-900/20 p-1 rounded max-w-[150px] truncate text-center" title={t.pmComment}>
                                                Lý do: {t.pmComment}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            {rejectingId === t._id ? (
                                                <div className="flex flex-col gap-2">
                                                    <textarea 
                                                        className="w-full bg-[#0f1f1b] border border-red-500/50 rounded p-1.5 text-xs text-white focus:outline-none"
                                                        placeholder="Lý do từ chối..."
                                                        rows={2}
                                                        value={rejectComment}
                                                        onChange={(e) => setRejectComment(e.target.value)}
                                                    />
                                                    <div className="flex gap-1">
                                                        <button 
                                                            className="flex-1 bg-gray-500/20 text-gray-400 text-[10px] py-1 rounded"
                                                            onClick={() => setRejectingId(null)}
                                                        >Hủy</button>
                                                        <button 
                                                            className="flex-1 bg-red-500/80 text-white text-[10px] py-1 rounded font-bold"
                                                            onClick={() => handleStatusChange(t._id, 'Rejected', rejectComment)}
                                                            disabled={!rejectComment}
                                                        >Gửi</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2 justify-center">
                                                    <button 
                                                        onClick={() => handleStatusChange(t._id, 'Approved')}
                                                        className="w-8 h-8 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                                                        title="Duyệt (Approve)"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => setRejectingId(t._id)}
                                                        className="w-8 h-8 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                                        title="Từ chối (Reject)"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
