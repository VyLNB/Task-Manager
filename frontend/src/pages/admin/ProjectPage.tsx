import React, { useEffect, useState } from 'react';
import { getAllProjectsAdmin } from '../../services/workspace';
import type { WorkspaceInterface } from '../../interfaces/workspace';
import { Users, FileText, CalendarDays, Loader2, X, Clock } from 'lucide-react';
import { WorkspaceTimesheets } from '../../components/workspace/WorkspaceTimesheets';

const ProjectPage: React.FC = () => {
    const [projects, setProjects] = useState<WorkspaceInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<WorkspaceInterface | null>(null);
    const [selectedProjectForTimesheet, setSelectedProjectForTimesheet] = useState<WorkspaceInterface | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await getAllProjectsAdmin();
                setProjects(response.data || []);
                setError(null);
            } catch (err: any) {
                console.error("Error fetching admin projects:", err);
                setError(err.message || 'Không thể tải danh sách dự án');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full text-teal-500">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FileText className="text-teal-500" />
                    Quản lý Dự án
                </h1>
                <p className="text-teal-200/60 mt-1">
                    Xem thông tin tất cả các dự án trong hệ thống.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-transparent">
                {projects.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-teal-200/50">
                        Không có dự án nào trong hệ thống.
                    </div>
                ) : (
                    projects.map((project) => (
                        <div
                            key={project._id}
                            className="bg-[#1a2f2a]/60 backdrop-blur-xl border border-teal-800/50 rounded-2xl p-6 hover:bg-[#1a2f2a]/80 hover:border-teal-600/50 transition-all shadow-lg flex flex-col h-full"
                        >
                            <div className="mb-4 flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-teal-100 truncate mb-1">
                                        {project.name}
                                    </h3>
                                </div>
                                {project.status && (
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md border
                                        ${project.status === 'Đã hoàn thành' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                                        ${project.status === 'Đang thực hiện' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : ''}
                                        ${project.status === 'Tạm dừng' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : ''}
                                        ${project.status === 'Kế hoạch' ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : ''}
                                    `}>
                                        {project.status}
                                    </span>
                                )}
                            </div>

                            <div className="flex-1"></div>

                            <div className="space-y-3 mt-4 pt-4 border-t border-teal-800/30 text-sm">
                                <div className="flex items-center text-teal-200/80">
                                    <span className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold mr-3 shrink-0">
                                        {/* @ts-ignore */}
                                        {project.leader?.fullName?.charAt(0) || '?'}
                                    </span>
                                    <div>
                                        <p className="text-xs text-teal-400/60 uppercase font-semibold">Project Manager</p>
                                        <p className="text-white truncate font-medium">
                                            {/* @ts-ignore */}
                                            {project.leader?.fullName || 'Không rõ'}
                                        </p>
                                    </div>
                                </div>

                                <div 
                                    className="flex items-center justify-between text-teal-200/80 bg-black/20 p-2.5 rounded-lg cursor-pointer hover:bg-teal-900/30 transition-colors"
                                    onClick={() => setSelectedProject(project)}
                                >
                                    <div className="flex items-center">
                                        <Users size={16} className="mr-3 text-teal-500 shrink-0" />
                                        <span className="font-medium">
                                            {project.members?.length || 0} thành viên
                                        </span>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-teal-500/70 border border-teal-500/30 px-2 py-0.5 rounded">Xem chi tiết</span>
                                </div>

                                <div 
                                    className="flex items-center justify-between text-teal-200/80 bg-black/20 p-2.5 rounded-lg cursor-pointer hover:bg-teal-900/30 transition-colors mt-2"
                                    onClick={() => setSelectedProjectForTimesheet(project)}
                                >
                                    <div className="flex items-center">
                                        <Clock size={16} className="mr-3 text-teal-500 shrink-0" />
                                        <span className="font-medium">
                                            Timesheet & Log Time
                                        </span>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-teal-500/70 border border-teal-500/30 px-2 py-0.5 rounded">Xem lịch sử</span>
                                </div>

                                {(project.startDate || project.endDate) && (
                                    <div className="flex items-center text-teal-200/60 bg-black/20 p-2.5 rounded-lg">
                                        <CalendarDays size={14} className="mr-3 shrink-0 text-teal-500" />
                                        <span className="text-xs font-medium">
                                            {project.startDate ? new Date(project.startDate).toLocaleDateString('vi-VN') : '...'} 
                                            {' - '} 
                                            {project.endDate ? new Date(project.endDate).toLocaleDateString('vi-VN') : '...'}
                                        </span>
                                    </div>
                                )}
                                
                                <div className="flex items-center text-teal-200/60 mt-2">
                                    <span className="text-xs">
                                        Tạo lúc: {new Date(project.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Member List Modal */}
            {selectedProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedProject(null)}>
                    <div 
                        className="bg-[#0f1f1b] border border-teal-800/50 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-5 border-b border-teal-800/50">
                            <div>
                                <h3 className="text-xl font-bold text-white">Thành viên dự án</h3>
                                <p className="text-teal-200/60 text-sm mt-1">{selectedProject.name}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedProject(null)}
                                className="text-teal-200/50 hover:text-white p-2 hover:bg-teal-900/30 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-transparent">
                            {selectedProject.members && selectedProject.members.length > 0 ? (
                                <div className="space-y-1 p-3">
                                    {selectedProject.members.map(member => (
                                        <div key={member._id} className="flex items-center p-3 hover:bg-teal-900/20 rounded-xl transition-colors">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullName)}&background=1a2f2a&color=2dd480&bold=true`}
                                                alt={member.fullName}
                                                className="w-10 h-10 rounded-full mr-4 border border-teal-800"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-medium truncate">{member.fullName}</p>
                                                <p className="text-teal-200/60 text-xs truncate">{member.email}</p>
                                            </div>
                                            {member._id === selectedProject.leader?._id && (
                                                <span className="ml-2 px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-teal-500/20 text-teal-400 border border-teal-500/30 whitespace-nowrap">
                                                    PM
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 text-center text-teal-200/50">
                                    Không có thành viên nào.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Timesheet Modal */}
            {selectedProjectForTimesheet && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedProjectForTimesheet(null)}>
                    <div 
                        className="bg-[#0f1f1b] border border-teal-800/50 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-5 border-b border-teal-800/50">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Clock className="text-teal-500" />
                                    Thời gian làm việc (Timesheet)
                                </h3>
                                <p className="text-teal-200/60 text-sm mt-1">{selectedProjectForTimesheet.name}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedProjectForTimesheet(null)}
                                className="text-teal-200/50 hover:text-white p-2 hover:bg-teal-900/30 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-transparent">
                            <WorkspaceTimesheets workspaceId={selectedProjectForTimesheet._id} isAdminView={true} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectPage;
