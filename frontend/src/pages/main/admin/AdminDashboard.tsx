import React, { useEffect, useState, useMemo } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell 
} from 'recharts';
import { Users, Briefcase, AlertCircle, Clock, CalendarDays } from 'lucide-react';
import { getAdminDashboardStats, type DashboardStats } from '../../../services/dashboard';

const COLORS = ['#14b8a6', '#0f766e', '#042f2e', '#2dd4bf'];

const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
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

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getAdminDashboardStats();
                if (response) {
                    setStats(response);
                }
            } catch (err: any) {
                setError(err.message || 'Lỗi khi tải dữ liệu dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="py-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-t-transparent border-teal-500 mb-6"></div>
                <p className="text-teal-200/60 font-medium text-lg animate-pulse">Đang phân tích dữ liệu...</p>
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
                    Tổng quan Hệ thống
                </h1>
                <p className="text-teal-200/60 text-lg ml-12">
                    Dành riêng cho Quản trị viên
                </p>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Card 1: Users */}
                <div className="bg-[#1a2f2a]/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_0_20px_rgba(20,184,166,0.15)] border border-teal-800/50 hover:scale-[1.02] hover:border-teal-400 hover:shadow-[0_0_25px_rgba(20,184,166,0.3)] transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-teal-200/60 font-medium text-sm mb-1 uppercase tracking-wider">Tổng User Hệ Thống</p>
                            <h3 className="text-4xl font-black text-white">{stats?.users.total}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-teal-900/40 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-[#0f1f1b] transition-colors">
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-teal-400 bg-teal-900/30 inline-block px-3 py-1 rounded-full">
                        + {stats?.users.newThisMonth} user mới trong tháng
                    </div>
                </div>

                {/* Card 2: Workspaces */}
                <div className="bg-[#1a2f2a]/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_0_20px_rgba(20,184,166,0.15)] border border-teal-800/50 hover:scale-[1.02] hover:border-teal-400 hover:shadow-[0_0_25px_rgba(20,184,166,0.3)] transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-teal-200/60 font-medium text-sm mb-1 uppercase tracking-wider">Tổng Dự Án (Workspace)</p>
                            <h3 className="text-4xl font-black text-white">{stats?.workspaces.total}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-teal-900/40 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-[#0f1f1b] transition-colors">
                            <Briefcase size={24} />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-teal-200/60 mt-2">
                        Tất cả các dự án trên hệ thống
                    </div>
                </div>

                {/* Card 3: Unfinished Workspaces */}
                <div className="bg-[#1a2f2a]/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_0_20px_rgba(20,184,166,0.15)] border border-teal-800/50 hover:scale-[1.02] hover:border-orange-400 hover:shadow-[0_0_25px_rgba(251,146,60,0.3)] transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-teal-200/60 font-medium text-sm mb-1 uppercase tracking-wider">Dự án chưa hoàn thành</p>
                            <h3 className="text-4xl font-black text-white">{stats?.workspaces.unfinished}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-orange-900/40 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-[#0f1f1b] transition-colors">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-orange-400 bg-orange-900/30 inline-block px-3 py-1 rounded-full">
                        Cần chú ý tiến độ
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
                            <Briefcase className="text-teal-400" />
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

            {/* List: Workspaces nearing deadline */}
            <div className="bg-[#1a2f2a]/60 backdrop-blur-md rounded-3xl p-8 shadow-[0_0_20px_rgba(20,184,166,0.1)] border border-teal-800/30">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <CalendarDays className="text-orange-400" />
                    Dự án sắp hết hạn (Trong 7 ngày tới)
                </h3>
                
                {stats?.nearDeadlineWorkspaces && stats.nearDeadlineWorkspaces.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.nearDeadlineWorkspaces.map(ws => {
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
                                        <span className="truncate">{ws.leader.fullName}</span>
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
                        <p className="text-teal-200/60 font-medium">Không có dự án nào sắp hết hạn trong 7 ngày tới.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default AdminDashboard;
