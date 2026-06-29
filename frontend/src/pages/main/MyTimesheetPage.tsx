import React, { useEffect, useState } from 'react';
import { getMyTimesheets, deleteTimesheet } from '../../services/timesheet';
import type { TimesheetInterface } from '../../interfaces/timesheet';
import { Clock, Calendar, FileText, CheckCircle2, XCircle, Trash2, Loader2 } from 'lucide-react';

export const MyTimesheetPage: React.FC = () => {
    const [timesheets, setTimesheets] = useState<TimesheetInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Default selected date to today (YYYY-MM-DD)
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });

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


    const filteredTimesheets = timesheets.filter(t => {
        if (!selectedDate) return true;
        const d = new Date(t.date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const tDateStr = `${year}-${month}-${day}`;
        return tDateStr === selectedDate;
    });

    const groupedTimesheets = filteredTimesheets.reduce((acc, curr) => {
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

    const displayTotalHours = Object.values(groupedTimesheets).reduce((sum, group) => sum + group.totalHours, 0);
    
    const isToday = () => {
        if (!selectedDate) return false;
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return selectedDate === `${year}-${month}-${day}`;
    };

    return (
        <div className="p-8 max-w-[1200px] mx-auto min-h-screen text-slate-200 font-sans">
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2 tracking-tight">
                        <Clock className="text-teal-400" size={32} />
                        Lịch sử Làm việc
                    </h1>
                    <p className="text-slate-400 ml-11 font-medium text-sm">
                        Xem chi tiết thời gian đã ghi nhận cho các công việc.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-end gap-4">
                    <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                        <label className="text-slate-400 text-xs font-medium px-1">Lọc theo ngày</label>
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-3 sm:py-2.5 text-slate-200 text-sm outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all duration-200 [color-scheme:dark] w-full"
                        />
                    </div>
                    
                    <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] p-4 sm:p-5 rounded-2xl flex items-center gap-4 sm:gap-5 shadow-2xl transition-transform hover:scale-[1.02] duration-300 w-full sm:w-auto">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg sm:text-xl ring-1 ring-teal-500/30 shadow-inner shrink-0">
                            Σ
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider mb-1">
                                Tổng thời gian {selectedDate ? (isToday() ? '(Hôm nay)' : `(${new Date(selectedDate).toLocaleDateString('vi-VN')})`) : '(Tất cả)'}
                            </p>
                            <p className="text-white text-2xl sm:text-3xl font-black tracking-tight">{displayTotalHours.toFixed(1)} <span className="text-sm sm:text-base text-slate-500 font-medium">Giờ</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-rose-500/10 text-rose-400 p-4 rounded-xl mb-8 border border-rose-500/20 font-medium flex items-center gap-3 text-sm shadow-sm backdrop-blur-sm">
                    <XCircle size={18} />
                    {error}
                </div>
            )}

            {loading ? (
                <div className="py-24 flex flex-col items-center justify-center text-teal-500 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <p className="text-slate-400 font-medium animate-pulse text-sm">Đang tải dữ liệu...</p>
                </div>
            ) : timesheets.length === 0 ? (
                <div className="text-center py-24 bg-white/[0.02] border border-white/[0.05] rounded-3xl shadow-lg backdrop-blur-sm">
                    <Clock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-base font-medium">Bạn chưa ghi nhận thời gian nào.</p>
                </div>
            ) : (
                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                                    <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Workspace</th>
                                    <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Công việc</th>
                                    <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Thời gian</th>
                                    <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Chi tiết / Kết quả</th>
                                    <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-4 text-slate-400 font-semibold text-xs uppercase tracking-wider w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedDates.map(dateStr => {
                                    const group = groupedTimesheets[dateStr];
                                    return (
                                        <React.Fragment key={dateStr}>
                                            <tr className="bg-white/[0.03] border-b border-white/[0.05]">
                                                <td colSpan={6} className="px-6 py-3">
                                                    <div className="flex justify-between items-center">
                                                        <div className="font-bold text-white text-sm flex items-center gap-2">
                                                            <Calendar size={15} className="text-teal-400" />
                                                            {dateStr}
                                                        </div>
                                                        <div className="text-teal-300 font-semibold bg-teal-500/10 px-3 py-1 rounded-full ring-1 ring-inset ring-teal-500/20 text-xs">
                                                            Tổng: {group.totalHours.toFixed(1)} Giờ
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            {group.timesheets.map((t) => (
                                                <tr key={t._id} className="border-b border-white/[0.02] hover:bg-white/[0.04] transition-colors duration-200 group">
                                                    <td className="px-6 py-4 align-top">
                                                        <div className="text-sm font-medium text-slate-300">
                                                            {t.workspaceId?.name || 'Workspace'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        <p className="text-slate-200 font-medium line-clamp-2 text-sm leading-relaxed">{t.taskId?.title || 'Unknown Task'}</p>
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <span className="bg-slate-800/50 text-slate-300 ring-1 ring-white/10 px-2 py-0.5 rounded-md text-[11px] font-semibold font-mono tracking-wide">
                                                                {t.startTime}
                                                            </span>
                                                            <span className="text-slate-600 text-xs">-</span>
                                                            <span className="bg-slate-800/50 text-slate-300 ring-1 ring-white/10 px-2 py-0.5 rounded-md text-[11px] font-semibold font-mono tracking-wide">
                                                                {t.endTime}
                                                            </span>
                                                        </div>
                                                        <div className="text-[13px] text-teal-400 font-semibold">
                                                            {t.hours} Giờ
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        <div className="text-[13px] text-slate-400 mb-2 line-clamp-2 leading-relaxed">
                                                            <FileText size={14} className="inline mr-1.5 text-slate-500 -mt-0.5" />
                                                            {t.description}
                                                        </div>
                                                        {t.result && (
                                                            <div className="text-xs text-slate-300 truncate bg-white/[0.03] ring-1 ring-white/10 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                                                                <span className="font-semibold text-slate-500">KQ:</span> {t.result}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 align-top">
                                                        {t.status === 'Approved' && (
                                                            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                                                                <CheckCircle2 size={13} /> Approved
                                                            </span>
                                                        )}
                                                        {t.status === 'Pending' && (
                                                            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                                                                <Clock size={13} /> Pending
                                                            </span>
                                                        )}
                                                        {t.status === 'Rejected' && (
                                                            <div className="flex flex-col gap-2 items-start">
                                                                <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/20 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                                                                    <XCircle size={13} /> Rejected
                                                                </span>
                                                                {t.pmComment && (
                                                                    <span className="text-[11px] text-rose-300/80 bg-rose-950/30 p-2 rounded-lg line-clamp-2 ring-1 ring-rose-500/20 max-w-[200px] leading-relaxed">
                                                                        {t.pmComment}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 align-top text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        {t.status === 'Pending' && (
                                                            <button 
                                                                onClick={() => handleDelete(t._id)}
                                                                className="text-slate-500 hover:text-rose-400 transition-all duration-200 p-2 hover:bg-rose-500/10 rounded-xl"
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
