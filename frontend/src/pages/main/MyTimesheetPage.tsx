import React, { useEffect, useState } from 'react';
import { getMyTimesheets, deleteTimesheet } from '../../services/timesheet';
import type { TimesheetInterface } from '../../interfaces/timesheet';
import { Clock, Calendar, FileText, CheckCircle2, XCircle, Trash2, Loader2 } from 'lucide-react';

export const MyTimesheetPage: React.FC = () => {
    const [timesheets, setTimesheets] = useState<TimesheetInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTimesheets = async () => {
        try {
            setLoading(true);
            const res = await getMyTimesheets();
            setTimesheets(res.data || []);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Không thể tải lịch sử làm việc');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTimesheets();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bạn có chắc muốn xóa bản ghi này?')) return;
        try {
            await deleteTimesheet(id);
            setTimesheets(timesheets.filter(t => t._id !== id));
        } catch (err: any) {
            alert(err.message || 'Lỗi khi xóa bản ghi');
        }
    };


    const groupedTimesheets = timesheets.reduce((acc, curr) => {
        const dateStr = new Date(curr.date).toLocaleDateString('vi-VN');
        if (!acc[dateStr]) {
            acc[dateStr] = {
                date: curr.date,
                timesheets: [],
                totalHours: 0
            };
        }
        acc[dateStr].timesheets.push(curr);
        if (curr.status !== 'Rejected') {
            acc[dateStr].totalHours += curr.hours;
        }
        return acc;
    }, {} as Record<string, { date: string | Date, timesheets: TimesheetInterface[], totalHours: number }>);

    const sortedDates = Object.keys(groupedTimesheets).sort((a, b) => new Date(groupedTimesheets[b].date).getTime() - new Date(groupedTimesheets[a].date).getTime());

    const todayStr = new Date().toLocaleDateString('vi-VN');
    const todayTotalHours = groupedTimesheets[todayStr]?.totalHours || 0;

    return (
        <div className="p-8 max-w-[1200px] mx-auto min-h-screen">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2">
                        <Clock className="text-amber-400" size={32} />
                        Lịch sử Làm việc (Timesheet)
                    </h1>
                    <p className="text-amber-200/60 ml-11">
                        Xem chi tiết thời gian đã ghi nhận cho các công việc.
                    </p>
                </div>
                <div className="bg-[#1a2f2a]/60 border border-teal-800/50 p-4 rounded-2xl flex items-center gap-4 shadow-lg">
                    <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xl">
                        Σ
                    </div>
                    <div>
                        <p className="text-teal-200/60 text-xs font-bold uppercase">Tổng thời gian (Hôm nay)</p>
                        <p className="text-white text-2xl font-black">{todayTotalHours.toFixed(1)} <span className="text-sm text-gray-400 font-medium">Giờ</span></p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl mb-8 border border-red-500/20 font-medium">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="py-20 flex justify-center text-teal-500">
                    <Loader2 className="w-10 h-10 animate-spin" />
                </div>
            ) : timesheets.length === 0 ? (
                <div className="text-center py-20 bg-[#1a2f2a]/40 border border-teal-800/30 rounded-3xl">
                    <Clock className="w-16 h-16 text-teal-800/50 mx-auto mb-4" />
                    <p className="text-teal-200/60 text-lg">Bạn chưa ghi nhận thời gian nào.</p>
                </div>
            ) : (
                <div className="bg-[#1a2f2a]/60 border border-teal-800/50 rounded-3xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-teal-800/50 bg-[#0f1f1b]/50">
                                    <th className="p-4 text-teal-200/60 font-bold text-sm uppercase">Workspace</th>
                                    <th className="p-4 text-teal-200/60 font-bold text-sm uppercase">Công việc</th>
                                    <th className="p-4 text-teal-200/60 font-bold text-sm uppercase">Thời gian</th>
                                    <th className="p-4 text-teal-200/60 font-bold text-sm uppercase">Chi tiết / Kết quả</th>
                                    <th className="p-4 text-teal-200/60 font-bold text-sm uppercase">Trạng thái</th>
                                    <th className="p-4 text-teal-200/60 font-bold text-sm uppercase w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedDates.map(dateStr => {
                                    const group = groupedTimesheets[dateStr];
                                    return (
                                        <React.Fragment key={dateStr}>
                                            <tr className="bg-[#1a2f2a]/80 border-b border-teal-800/50">
                                                <td colSpan={6} className="p-4">
                                                    <div className="flex justify-between items-center">
                                                        <div className="font-bold text-teal-300 text-lg flex items-center gap-2">
                                                            <Calendar size={18} />
                                                            Ngày: {dateStr}
                                                        </div>
                                                        <div className="text-amber-400 font-bold bg-amber-900/30 px-3 py-1 rounded-lg border border-amber-500/20">
                                                            Tổng thời gian: {group.totalHours.toFixed(1)} Giờ
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            {group.timesheets.map((t) => (
                                                <tr key={t._id} className="border-b border-teal-800/30 hover:bg-[#0f1f1b]/30 transition-colors">
                                                    <td className="p-4 align-top">
                                                        <div className="text-sm font-medium text-teal-100">
                                                            {t.workspaceId?.name || 'Workspace'}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        <p className="text-teal-100 font-semibold line-clamp-2">{t.taskId?.title || 'Unknown Task'}</p>
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        <div className="flex items-center gap-2">
                                                            <span className="bg-teal-900/40 text-teal-400 px-2 py-1 rounded text-xs font-bold font-mono">
                                                                {t.startTime}
                                                            </span>
                                                            <span className="text-gray-500">-</span>
                                                            <span className="bg-teal-900/40 text-teal-400 px-2 py-1 rounded text-xs font-bold font-mono">
                                                                {t.endTime}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-amber-400/80 font-bold mt-1">
                                                            {t.hours} Giờ
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        <div className="text-sm text-gray-300 mb-1 line-clamp-2">
                                                            <FileText size={12} className="inline mr-1 text-gray-500" />
                                                            {t.description}
                                                        </div>
                                                        {t.result && (
                                                            <div className="text-xs text-teal-200/70 truncate bg-teal-900/20 px-2 py-1 rounded">
                                                                <span className="font-semibold mr-1">KQ:</span> {t.result}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        {t.status === 'Approved' && (
                                                            <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/30 px-2.5 py-1 rounded-full text-xs font-bold">
                                                                <CheckCircle2 size={12} /> Approved
                                                            </span>
                                                        )}
                                                        {t.status === 'Pending' && (
                                                            <span className="inline-flex items-center gap-1 bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-full text-xs font-bold">
                                                                <Clock size={12} /> Pending
                                                            </span>
                                                        )}
                                                        {t.status === 'Rejected' && (
                                                            <div className="flex flex-col gap-1">
                                                                <span className="inline-flex items-center gap-1 w-fit bg-red-500/10 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full text-xs font-bold">
                                                                    <XCircle size={12} /> Rejected
                                                                </span>
                                                                {t.pmComment && (
                                                                    <span className="text-[10px] text-red-400/70 bg-red-900/20 p-1.5 rounded line-clamp-2">
                                                                        {t.pmComment}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-4 align-top text-center">
                                                        {t.status === 'Pending' && (
                                                            <button 
                                                                onClick={() => handleDelete(t._id)}
                                                                className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                                                                title="Xóa"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
