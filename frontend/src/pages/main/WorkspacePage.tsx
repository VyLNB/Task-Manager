import React, { useEffect, useState } from 'react';
import type { WorkspaceInterface } from '../../interfaces/workspace';
import { getWorkspaces, createWorkspace } from '../../services/workspace';
import { Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceCard } from '../../components/workspace/WorkspaceCard';
const WorkspacePage = () => {
    const navigate = useNavigate();
    const [workspaces, setWorkspaces] = useState<WorkspaceInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [creating, setCreating] = useState(false);
    const [isCreatingUI, setIsCreatingUI] = useState(false);
    const [error, setError] = useState('');

    //lấy tất cả workspace
    const fetchWorkspaces = async () => {
        try {
            setLoading(true);
            const response = await getWorkspaces();
            setWorkspaces(response.data || []);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải workspace');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWorkspaceName.trim()) return;

        try {
            setCreating(true);
            await createWorkspace(newWorkspaceName);
            setNewWorkspaceName('');
            setIsCreatingUI(false);
            await fetchWorkspaces();
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tạo workspace');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-white flex items-center gap-4 mb-2">
                    <Users className="text-teal-400" size={36} />
                    Workspaces
                </h1>
                <p className="text-teal-200/60 text-lg ml-12">
                    Nơi bạn có thể làm việc nhóm hiệu quả hơn
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl mb-8 border border-red-500/20 font-medium">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="py-20 text-center flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-t-transparent border-teal-500 mb-6"></div>
                    <p className="text-teal-200/60 font-medium text-lg animate-pulse">Loading your workspaces...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                    {/* Create New Workspace Card */}
                    <div
                        className={`w-full max-w-md bg-[#1a2f2a]/60 backdrop-blur-md rounded-3xl p-6 shadow-lg flex flex-col justify-center items-center border-[3px] border-dashed ${isCreatingUI ? 'border-teal-800' : 'border-teal-800 hover:border-teal-400/50 hover:bg-[#1a2f2a]/80 cursor-pointer'} transition-all group min-h-[260px]`}
                        onClick={() => !isCreatingUI && setIsCreatingUI(true)}
                    >
                        {!isCreatingUI ? (
                            <>
                                <div className="w-16 h-16 rounded-full bg-teal-900/40 group-hover:bg-teal-400/20 flex items-center justify-center text-teal-400 mb-5 transition-colors group-hover:scale-110 duration-300">
                                    <Plus size={32} strokeWidth={3} />
                                </div>
                                <h3 className="text-teal-200/60 group-hover:text-teal-400 font-bold text-xl transition-colors">
                                    Tạo workspace mới
                                </h3>
                            </>
                        ) : (
                            <form
                                onSubmit={handleCreate}
                                className="w-full flex flex-col justify-center h-full animate-in fade-in zoom-in duration-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-white font-bold mb-4 text-xl text-center">Name your workspace</h3>
                                <input
                                    autoFocus
                                    type="text"
                                    value={newWorkspaceName}
                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                    placeholder="E.g. Marketing Team"
                                    className="w-full p-4 bg-[#0f1f1b] text-white border border-teal-700 rounded-2xl focus:outline-none focus:border-teal-500 mb-6 font-medium text-center text-lg placeholder:text-teal-200/40 transition-colors"
                                    disabled={creating}
                                />
                                <div className="flex gap-3 w-full">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsCreatingUI(false);
                                            setNewWorkspaceName('');
                                            setError('');
                                        }}
                                        className="flex-1 py-3 rounded-2xl text-teal-200/60 font-bold hover:bg-teal-900/40 hover:text-white transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creating || !newWorkspaceName.trim()}
                                        className="flex-1 py-3 rounded-2xl bg-teal-500 text-[#0f1f1b] font-extrabold hover:bg-teal-400 disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(20,184,166,0.3)]"
                                    >
                                        {creating ? 'Đang tạo...' : 'Tạo'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Mapping existing workspaces */}
                    {workspaces.map(ws => (
                        <WorkspaceCard
                            key={ws._id}
                            workspace={ws}
                            leader={ws.leader}
                            onOpen={(id) => navigate(`/todoapp/workspace/${id}`)}
                            category="WORKSPACE"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WorkspacePage;
