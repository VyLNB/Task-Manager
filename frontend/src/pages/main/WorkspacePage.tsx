import React, { useEffect, useState } from 'react';
import type { WorkspaceInterface } from '../../interfaces/workspace';
import { getWorkspaces, createWorkspace } from '../../services/workspace';
import { Users, Plus, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const WorkspacePage = () => {
    const [workspaces, setWorkspaces] = useState<WorkspaceInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

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
            await fetchWorkspaces();
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tạo workspace');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
                <Users className="text-green-600" size={32} />
                Quản lý Workspace
            </h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleCreate} className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">Tạo Workspace mới</h2>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newWorkspaceName}
                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                        placeholder="Nhập tên workspace..."
                        className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        disabled={creating}
                    />
                    <button
                        type="submit"
                        disabled={creating || !newWorkspaceName.trim()}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <Plus size={20} />
                        {creating ? 'Đang tạo...' : 'Tạo mới'}
                    </button>
                </div>
            </form>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-semibold text-gray-800">Danh sách Workspace của bạn</h2>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                        Đang tải danh sách...
                    </div>
                ) : workspaces.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 bg-gray-50/30">
                        <Users className="mx-auto text-gray-300 mb-3" size={48} />
                        Bạn chưa tham gia workspace nào.
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {workspaces.map(ws => (
                            <li key={ws._id} className="hover:bg-green-50/30 transition-colors group">
                                <Link to={`/todoapp/workspace/${ws._id}`} className="p-6 block">
                                    <div className="flex items-start justify-between">
                                        <div>
                                        <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-green-700 transition-colors">{ws.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                            <Shield size={14} className="text-green-600" />
                                            <span className="font-medium text-gray-700">Leader:</span>
                                            {ws.leader?.name || 'Unknown'} ({ws.leader?.email || 'N/A'})
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Users size={14} className="text-blue-500" />
                                            <span className="font-medium text-gray-700">Thành viên:</span>
                                            {ws.members?.length || 0} người
                                        </div>
                                    </div>
                                        <div className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                            {new Date(ws.createdAt).toLocaleDateString('vi-VN')}
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default WorkspacePage;
