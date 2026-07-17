import React, { useEffect, useState, useMemo } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell 
} from 'recharts';
import { Briefcase, AlertCircle, Clock, CalendarDays, CheckSquare } from 'lucide-react';
import { getPMDashboardStats, type PMDashboardStats } from '../../../services/dashboard';
import { approveTaskChangeRequest, rejectTaskChangeRequest } from '../../../services/task';

const COLORS = ['#14b8a6', '#0f766e', '#042f2e', '#2dd4bf'];

const PMDashboard = () => {
    const [stats, setStats] = useState<PMDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedWorkspace, setSelectedWorkspace] = useState('all');

    const tasksByStatus = useMemo(() => {
        if (!stats) return [];
        const statusMap: Record<string, number> = {};
        stats.tasksRaw.forEach(item => {
            if (selectedWorkspace === 'all' || item._id.workspaceId === selectedWorkspace) {
                statusMap[item._id.status] = (statusMap[item._id.status] || 0) + item.count;
            }
        });
        return Object.keys(statusMap).map(key => ({
            name: key,
            value: statusMap[key]
        }));
    }, [stats, selectedWorkspace]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await getPMDashboardStats();
            setStats(data);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải dữ liệu PM Dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await approveTaskChangeRequest(id);
            fetchStats();
        } catch (err: any) {
            alert(err.message || 'Lỗi duyệt yêu cầu');
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectTaskChangeRequest(id);
            fetchStats();
        } catch (err: any) {
            alert(err.message || 'Lỗi từ chối yêu cầu');
        }
    };

    if (loading) {
        return (
            <div className="py-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-t-transparent border-teal-500 mb-6"></div>
                <p className="text-teal-200/60 font-medium text-lg animate-pulse">Đang phân tích dữ liệu dự án...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-[1400px] mx-auto min-h-[60vh]">
                <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl border border-red-500/20 font-medium">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1400px] mx-auto min-h-screen animate-in fade-in zoom-in duration-500">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-white flex items-center gap-4 mb-2">
                    <Briefcase className="text-teal-400" size={36} />
                    Tổng quan Dự án
                </h1>
                <p className="text-teal-200/60 text-lg ml-12">
                    Dành riêng cho Project Manager
                </p>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Card 1: Total Projects */}
                <div className="bg-[#1a2f2a]/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_0_20px_rgba(20,184,166,0.15)] border border-teal-800/50 hover:scale-[1.02] hover:border-teal-400 hover:shadow-[0_0_25px_rgba(20,184,166,0.3)] transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-teal-200/60 font-medium text-sm mb-1 uppercase tracking-wider">Dự án quản lý</p>
                            <h3 className="text-4xl font-black text-white">{stats?.totalProjects}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-teal-900/40 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-[#0f1f1b] transition-colors">
                            <Briefcase size={24} />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-teal-200/60 mt-2">
                        Tổng số dự án bạn làm Leader
                    </div>
                </div>

                {/* Card 2: Pending Timesheets */}
                <div className="bg-[#1a2f2a]/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_0_20px_rgba(20,184,166,0.15)] border border-teal-800/50 hover:scale-[1.02] hover:border-teal-400 hover:shadow-[0_0_25px_rgba(20,184,166,0.3)] transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-teal-200/60 font-medium text-sm mb-1 uppercase tracking-wider">Timesheet chưa duyệt</p>
                            <h3 className="text-4xl font-black text-white">{stats?.pendingTimesheets}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-teal-900/40 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-[#0f1f1b] transition-colors">
                            <CheckSquare size={24} />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-teal-400 bg-teal-900/30 inline-block px-3 py-1 rounded-full">
                        Cần được kiểm tra & duyệt
                    </div>
                </div>

                {/* Card 3: Near Deadline Projects */}
                <div className="bg-[#1a2f2a]/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_0_20px_rgba(20,184,166,0.15)] border border-teal-800/50 hover:scale-[1.02] hover:border-orange-400 hover:shadow-[0_0_25px_rgba(251,146,60,0.3)] transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-teal-200/60 font-medium text-sm mb-1 uppercase tracking-wider">Dự án sắp hết hạn</p>
                            <h3 className="text-4xl font-black text-white">{stats?.nearDeadlineProjects.length}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-orange-900/40 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-[#0f1f1b] transition-colors">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-orange-400 bg-orange-900/30 inline-block px-3 py-1 rounded-full">
                        Trong vòng 7 ngày tới
                    </div>
                </div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Bar Chart: Working Time by Workspace */}
                <div className="bg-[#1a2f2a]/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_0_20px_rgba(20,184,166,0.1)] border border-teal-800/30">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Clock className="text-teal-400" />
                        Thời gian làm việc theo dự án
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.workingTimeByWorkspace || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#042f2e" vertical={false} />
                                <XAxis dataKey="workspaceName" stroke="#5eead4" tick={{ fill: '#5eead4', fontSize: 12 }} />
                                <YAxis stroke="#5eead4" tick={{ fill: '#5eead4', fontSize: 12 }} />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(20, 184, 166, 0.1)' }} 
                                    contentStyle={{ backgroundColor: '#0f1f1b', border: '1px solid #115e59', borderRadius: '12px', color: '#fff' }} 
                                />
                                <Bar dataKey="hours" name="Giờ làm việc" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Tasks by Status */}
                <div className="bg-[#1a2f2a]/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_0_20px_rgba(20,184,166,0.1)] border border-teal-800/30 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <CheckSquare className="text-teal-400" />
                            Phân bố công việc
                        </h3>
                        <select
                            value={selectedWorkspace}
                            onChange={(e) => setSelectedWorkspace(e.target.value)}
                            className="bg-[#0f1f1b] text-teal-400 border border-teal-700/50 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-teal-500 cursor-pointer"
                        >
                            <option value="all">Tất cả dự án</option>
                            {stats?.allWorkspaces.map(ws => (
                                <option key={ws._id} value={ws._id}>{ws.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={tasksByStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {tasksByStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f1f1b', border: '1px solid #115e59', borderRadius: '12px', color: '#fff' }} />
                                <Legend wrapperStyle={{ color: '#5eead4' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Pending Time Change Requests */}
            {stats?.pendingChangeRequests && stats.pendingChangeRequests.length > 0 && (
                <div className="bg-[#1a2f2a]/60 backdrop-blur-md rounded-3xl p-8 shadow-[0_0_20px_rgba(20,184,166,0.1)] border border-teal-800/30 mb-8 animate-in slide-in-from-bottom">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Clock className="text-orange-400" />
                        Yêu cầu thay đổi thời gian chờ duyệt
                    </h3>
                    
                    <div className="space-y-4">
                        {stats.pendingChangeRequests.map(req => (
                            <div key={req._id} className="bg-[#0f1f1b] border border-orange-500/20 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-orange-500/50 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-teal-900/40 text-teal-300 text-xs px-2 py-1 rounded-md font-semibold">
                                            {req.workspaceId?.name}
                                        </span>
                                        <h4 className="text-white font-bold">{req.taskId?.title}</h4>
                                    </div>
                                    
                                    <div className="text-sm text-teal-200/60 mb-2">
                                        Người yêu cầu: <span className="text-teal-300 font-medium">{req.requestedBy?.fullName}</span>
                                    </div>
                                    
                                    <div className="flex gap-4 flex-wrap text-sm">
                                        {req.changes?.estimatedHours && (
                                            <div className="bg-orange-500/10 text-orange-200 px-3 py-1.5 rounded-lg border border-orange-500/20">
                                                Giờ dự kiến: <span className="line-through opacity-70">{req.changes.estimatedHours.old || 0}h</span> <span className="text-orange-400 font-bold mx-1">→</span> <span className="font-bold">{req.changes.estimatedHours.new}h</span>
                                            </div>
                                        )}
                                        {req.changes?.startDate && (
                                            <div className="bg-orange-500/10 text-orange-200 px-3 py-1.5 rounded-lg border border-orange-500/20">
                                                Ngày bắt đầu: <span className="line-through opacity-70">{req.changes.startDate.old ? new Date(req.changes.startDate.old).toLocaleDateString('vi-VN') : 'Trống'}</span> <span className="text-orange-400 font-bold mx-1">→</span> <span className="font-bold">{new Date(req.changes.startDate.new).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                        )}
                                        {req.changes?.dueDate && (
                                            <div className="bg-orange-500/10 text-orange-200 px-3 py-1.5 rounded-lg border border-orange-500/20">
                                                Hạn chót: <span className="line-through opacity-70">{req.changes.dueDate.old ? new Date(req.changes.dueDate.old).toLocaleDateString('vi-VN') : 'Trống'}</span> <span className="text-orange-400 font-bold mx-1">→</span> <span className="font-bold">{new Date(req.changes.dueDate.new).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                                    <button 
                                        onClick={() => handleReject(req._id)}
                                        className="flex-1 md:flex-none px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 rounded-xl font-bold transition-colors"
                                    >
                                        Từ chối
                                    </button>
                                    <button 
                                        onClick={() => handleApprove(req._id)}
                                        className="flex-1 md:flex-none px-4 py-2 bg-teal-500 text-[#0f1f1b] hover:bg-teal-400 font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(20,184,166,0.3)]"
                                    >
                                        Duyệt
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* List: Workspaces nearing deadline */}
            <div className="bg-[#1a2f2a]/60 backdrop-blur-md rounded-3xl p-8 shadow-[0_0_20px_rgba(20,184,166,0.1)] border border-teal-800/30">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <CalendarDays className="text-orange-400" />
                    Dự án quản lý sắp hết hạn (Trong 7 ngày tới)
                </h3>
                
                {stats?.nearDeadlineProjects && stats.nearDeadlineProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.nearDeadlineProjects.map(ws => {
                            const endDate = new Date(ws.endDate);
                            const now = new Date();
                            const diffTime = endDate.getTime() - now.getTime();
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            
                            return (
                                <div key={ws._id} className="bg-[#0f1f1b] rounded-2xl p-5 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all animate-pulse duration-1000">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="text-white font-bold text-lg truncate pr-2">{ws.name}</h4>
                                        <span className="text-xs font-bold bg-orange-500/20 text-orange-400 px-2 py-1 rounded-md whitespace-nowrap">
                                            Còn {diffDays} ngày
                                        </span>
                                    </div>
                                    <div className="text-sm text-teal-200/60 mb-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-teal-900 flex items-center justify-center text-xs text-teal-400 font-bold">
                                            {ws.leader.fullName.charAt(0)}
                                        </div>
                                        <span className="truncate">{ws.leader.fullName} (Bạn)</span>
                                    </div>
                                    <div className="text-xs text-teal-200/40">
                                        Hạn chót: {endDate.toLocaleDateString('vi-VN')}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed border-teal-800/50 rounded-2xl">
                        <div className="w-16 h-16 rounded-full bg-teal-900/30 flex items-center justify-center mx-auto mb-4 text-teal-500">
                            <CalendarDays size={32} />
                        </div>
                        <p className="text-teal-200/60 font-medium">Bạn không có dự án nào sắp hết hạn trong 7 ngày tới.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default PMDashboard;
