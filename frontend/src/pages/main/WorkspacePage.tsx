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
                    <Users className="text-[#2DD480]" size={36} />
                    Workspaces
                </h1>
                <p className="text-[#8a9f91] text-lg ml-12">
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
                    <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-t-transparent border-[#2DD480] mb-6"></div>
                    <p className="text-[#8a9f91] font-medium text-lg animate-pulse">Loading your workspaces...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                    {/* Create New Workspace Card */}
                    <div
                        className={`w-full max-w-md bg-[#1a261e]/40 rounded-3xl p-6 shadow-lg flex flex-col justify-center items-center border-[3px] border-dashed ${isCreatingUI ? 'border-[#283b2e]' : 'border-[#283b2e] hover:border-[#7bf192]/50 hover:bg-[#1a261e]/80 cursor-pointer'} transition-all group min-h-[260px]`}
                        onClick={() => !isCreatingUI && setIsCreatingUI(true)}
                    >
                        {!isCreatingUI ? (
                            <>
                                <div className="w-16 h-16 rounded-full bg-[#283b2e] group-hover:bg-[#7bf192]/20 flex items-center justify-center text-[#7bf192] mb-5 transition-colors group-hover:scale-110 duration-300">
                                    <Plus size={32} strokeWidth={3} />
                                </div>
                                <h3 className="text-[#8a9f91] group-hover:text-[#7bf192] font-bold text-xl transition-colors">
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
                                    className="w-full p-4 bg-[#0d1511] text-white border-2 border-[#283b2e] rounded-2xl focus:outline-none focus:border-[#7bf192] mb-6 font-medium text-center text-lg placeholder:text-gray-600 transition-colors"
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
                                        className="flex-1 py-3 rounded-2xl text-[#8a9f91] font-bold hover:bg-[#283b2e] hover:text-white transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creating || !newWorkspaceName.trim()}
                                        className="flex-1 py-3 rounded-2xl bg-[#7bf192] text-[#1a261e] font-extrabold hover:bg-[#69db80] disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(45,212,128,0.2)]"
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
