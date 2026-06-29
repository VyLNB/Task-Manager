import { useEffect, useState } from "react";
import { getAllUsers, toggleUserStatus } from "../../../services/user";
import { getAllRoles, assignRole, createRole, updateRole } from "../../../services/role";
import type { UserInterface } from "../../../interfaces/user";
import type { RoleInterface } from "../../../interfaces/role";
import { getAllTimesheets } from "../../../services/timesheet";
import type { TimesheetInterface } from "../../../interfaces/timesheet";
import { Shield, User, Mail, Calendar, Key, AlertCircle, Plus, Edit2, X, CheckCircle2, Power, Clock } from "lucide-react";

const AVAILABLE_PERMISSIONS = [
    { id: 'ALL', label: 'Toàn quyền hệ thống (ALL)' },
    { id: 'MANAGE_USERS', label: 'Quản lý người dùng' },
    { id: 'MANAGE_ROLES', label: 'Quản lý Role & Phân quyền' },
    { id: 'CREATE_TASK', label: 'Tạo công việc' },
    { id: 'UPDATE_TASK', label: 'Cập nhật công việc' },
    { id: 'DELETE_TASK', label: 'Xóa công việc' },
    { id: 'VIEW_TASK', label: 'Xem công việc' }
];

export default function PersonnelPage() {
    const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'timesheets'>('users');
    const [users, setUsers] = useState<UserInterface[]>([]);
    const [roles, setRoles] = useState<RoleInterface[]>([]);
    const [timesheets, setTimesheets] = useState<TimesheetInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Role Modal States
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleInterface | null>(null);
    const [roleForm, setRoleForm] = useState({ name: '', permissions: [] as string[] });
    const [isSavingRole, setIsSavingRole] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersData, rolesData, timesheetsData] = await Promise.all([
                getAllUsers(),
                getAllRoles(),
                getAllTimesheets().catch(() => ({ data: [] })) // Graceful fail if API lacks perms or error
            ]);
            setUsers(usersData);
            setRoles(rolesData);
            setTimesheets(timesheetsData.data || []);
        } catch (err) {
            const error = err as any;
            setError(error.response?.data?.message || "Lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRoleId: string) => {
        try {
            setUpdatingId(userId);
            await assignRole(userId, newRoleId);
            setUsers(users.map(u => {
                if (u._id === userId) {
                    const matchedRole = roles.find(r => r._id === newRoleId);
                    return {
                        ...u,
                        roleId: matchedRole ? { _id: matchedRole._id, name: matchedRole.name, permissions: matchedRole.permissions } : undefined
                    };
                }
                return u;
            }));
        } catch (err) {
            const error = err as any;
            alert(error.response?.data?.message || "Lỗi khi cập nhật quyền");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleToggleStatus = async (userId: string) => {
        try {
            setUpdatingId(userId);
            const res = await toggleUserStatus(userId);
            setUsers(users.map(u => 
                u._id === userId ? { ...u, isActive: res.isActive } : u
            ));
        } catch (err) {
            const error = err as any;
            alert(error.response?.data?.message || "Lỗi khi cập nhật trạng thái");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleOpenRoleModal = (role?: RoleInterface) => {
        if (role) {
            setEditingRole(role);
            setRoleForm({ name: role.name, permissions: [...role.permissions] });
        } else {
            setEditingRole(null);
            setRoleForm({ name: '', permissions: [] });
        }
        setIsRoleModalOpen(true);
    };

    const handleTogglePermission = (permId: string) => {
        setRoleForm(prev => {
            if (prev.permissions.includes(permId)) {
                return { ...prev, permissions: prev.permissions.filter(p => p !== permId) };
            } else {
                return { ...prev, permissions: [...prev.permissions, permId] };
            }
        });
    };

    const handleSaveRole = async () => {
        if (!roleForm.name.trim()) {
            alert("Vui lòng nhập tên Role!");
            return;
        }
        try {
            setIsSavingRole(true);
            if (editingRole) {
                const updated = await updateRole(editingRole._id, roleForm.name, roleForm.permissions);
                setRoles(roles.map(r => r._id === updated._id ? updated : r));
            } else {
                const created = await createRole(roleForm.name, roleForm.permissions);
                setRoles([...roles, created]);
            }
            setIsRoleModalOpen(false);
        } catch (err) {
            const error = err as any;
            alert(error.response?.data?.message || "Lỗi khi lưu Role");
        } finally {
            setIsSavingRole(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-red-500 space-y-4">
                <AlertCircle size={48} />
                <h2 className="text-xl font-semibold">Từ chối truy cập</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <Shield className="mr-3 text-teal-400" size={32} />
                        Quản trị Nhân sự
                    </h1>
                    <p className="text-teal-200/60 mt-1">
                        Quản lý danh sách thành viên và thiết lập phân quyền
                    </p>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-teal-800/50 space-x-8">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`pb-4 text-lg font-medium transition-colors relative ${activeTab === 'users' ? 'text-teal-400' : 'text-teal-100/60 hover:text-teal-200'}`}
                >
                    Danh sách Nhân sự
                    {activeTab === 'users' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 rounded-t-full shadow-[0_0_8px_rgba(45,212,128,0.8)]"></span>}
                </button>
                <button
                    onClick={() => setActiveTab('roles')}
                    className={`pb-4 text-lg font-medium transition-colors relative ${activeTab === 'roles' ? 'text-teal-400' : 'text-teal-100/60 hover:text-teal-200'}`}
                >
                    Quản lý Role
                    {activeTab === 'roles' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 rounded-t-full shadow-[0_0_8px_rgba(45,212,128,0.8)]"></span>}
                </button>
                <button
                    onClick={() => setActiveTab('timesheets')}
                    className={`pb-4 text-lg font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'timesheets' ? 'text-teal-400' : 'text-teal-100/60 hover:text-teal-200'}`}
                >
                    <Clock size={20} />
                    Thống kê thời gian
                    {activeTab === 'timesheets' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 rounded-t-full shadow-[0_0_8px_rgba(45,212,128,0.8)]"></span>}
                </button>
            </div>

            {/* TAB 1: USER MANAGEMENT */}
            {activeTab === 'users' && (
                <div className="bg-[#1a2f2a]/60 backdrop-blur-md border border-teal-800/50 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-4 border-b border-teal-800/50 flex justify-between items-center bg-teal-900/20">
                        <h2 className="text-lg font-semibold text-white">Thành viên hệ thống</h2>
                        <div className="bg-[#0f1f1b] border border-teal-800/50 rounded-lg px-3 py-1 flex items-center gap-2">
                            <span className="text-teal-200/80 text-sm">Tổng số:</span>
                            <span className="text-lg font-bold text-teal-400">{users.length}</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-teal-900/40 border-b border-teal-800/50">
                                    <th className="py-4 px-6 font-semibold text-teal-100/80">Thành viên</th>
                                    <th className="py-4 px-6 font-semibold text-teal-100/80">Liên hệ</th>
                                    <th className="py-4 px-6 font-semibold text-teal-100/80">Ngày tham gia</th>
                                    <th className="py-4 px-6 font-semibold text-teal-100/80">Trạng thái</th>
                                    <th className="py-4 px-6 font-semibold text-teal-100/80 w-64">Phân quyền (Role)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-teal-800/30">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-teal-800/20 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-teal-800/50 flex items-center justify-center text-teal-300">
                                                    <User size={20} />
                                                </div>
                                                <span className="font-medium text-white">{user.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-teal-200/80">
                                                <Mail size={16} className="text-teal-500/70" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-teal-200/80">
                                                <Calendar size={16} className="text-teal-500/70" />
                                                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(user._id)}
                                                    disabled={updatingId === user._id}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border flex items-center gap-1.5
                                                        ${user.isActive !== false 
                                                            ? 'bg-teal-500/10 text-teal-400 border-teal-500/30 hover:bg-teal-500/20' 
                                                            : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'}
                                                        ${updatingId === user._id ? 'opacity-50 cursor-wait' : ''}
                                                    `}
                                                    title={user.isActive !== false ? 'Nhấn để Khóa' : 'Nhấn để Kích hoạt'}
                                                >
                                                    <Power size={14} />
                                                    {user.isActive !== false ? 'Hoạt động' : 'Đã khóa'}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 relative">
                                                <Key size={16} className="text-teal-400 absolute left-3 pointer-events-none" />
                                                <select
                                                    value={user.roleId?._id || ""}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    disabled={updatingId === user._id}
                                                    className={`pl-9 bg-[#0f1f1b] border border-teal-700 text-teal-100 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 outline-none transition-colors cursor-pointer hover:border-teal-500 appearance-none
                                                        ${updatingId === user._id ? 'opacity-50 cursor-wait' : ''}
                                                    `}
                                                >
                                                    <option value="" disabled>-- Chọn quyền --</option>
                                                    {roles.map((role) => (
                                                        <option key={role._id} value={role._id}>
                                                            {role.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-teal-200/60">
                                            Chưa có người dùng nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 2: ROLE MANAGEMENT */}
            {activeTab === 'roles' && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button
                            onClick={() => handleOpenRoleModal()}
                            className="bg-teal-500 hover:bg-teal-400 text-[#0f1f1b] font-bold py-2.5 px-5 rounded-xl shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_20px_rgba(20,184,166,0.5)] transition-all flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Tạo Role Mới
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {roles.map(role => (
                            <div key={role._id} className="bg-[#1a2f2a]/60 backdrop-blur-md border border-teal-800/50 rounded-2xl p-6 shadow-xl hover:border-teal-600 transition-colors flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Shield className="text-teal-400" size={24} />
                                        {role.name}
                                    </h3>
                                    <button
                                        onClick={() => handleOpenRoleModal(role)}
                                        className="p-2 bg-teal-900/40 hover:bg-teal-800 text-teal-300 rounded-lg transition-colors"
                                        title="Chỉnh sửa Role"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-teal-200/60 mb-3 font-medium">Quyền hạn ({role.permissions.length}):</p>
                                    <div className="flex flex-wrap gap-2">
                                        {role.permissions.map(perm => (
                                            <span key={perm} className="bg-teal-950 border border-teal-800/50 text-teal-300 text-xs px-2.5 py-1 rounded-md">
                                                {perm}
                                            </span>
                                        ))}
                                        {role.permissions.length === 0 && (
                                            <span className="text-teal-200/40 text-sm italic">Không có quyền nào</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 3: TIMESHEET STATS */}
            {activeTab === 'timesheets' && (
                <div className="bg-[#1a2f2a]/60 backdrop-blur-md border border-teal-800/50 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-4 border-b border-teal-800/50 flex justify-between items-center bg-teal-900/20">
                        <h2 className="text-lg font-semibold text-white">Tổng hợp thời gian làm việc (Toàn hệ thống)</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-teal-900/40 border-b border-teal-800/50">
                                    <th className="py-4 px-6 font-semibold text-teal-100/80">Thành viên</th>
                                    <th className="py-4 px-6 font-semibold text-teal-100/80 text-center">Tổng thời gian đã Log</th>
                                    <th className="py-4 px-6 font-semibold text-teal-100/80 text-center">Đã Duyệt (Approved)</th>
                                    <th className="py-4 px-6 font-semibold text-teal-100/80 text-center">Chờ Duyệt (Pending)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-teal-800/30">
                                {users.map((user) => {
                                    // Aggregate for this user
                                    const userTimesheets = timesheets.filter(t => 
                                        typeof t.userId === 'object' ? t.userId._id === user._id : t.userId === user._id
                                    );
                                    let total = 0, approved = 0, pending = 0;
                                    userTimesheets.forEach(t => {
                                        total += t.hours;
                                        if (t.status === 'Approved') approved += t.hours;
                                        if (t.status === 'Pending') pending += t.hours;
                                    });

                                    return (
                                        <tr key={user._id} className="hover:bg-teal-800/20 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-teal-800/50 flex items-center justify-center text-teal-300">
                                                        <User size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white">{user.fullName}</div>
                                                        <div className="text-xs text-teal-200/60">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="font-bold text-teal-400 text-lg">{Math.round(total * 100) / 100}h</span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="font-bold text-green-400 text-lg">{Math.round(approved * 100) / 100}h</span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="font-bold text-amber-400 text-lg">{Math.round(pending * 100) / 100}h</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-teal-200/60">
                                            Không có dữ liệu.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL: CREATE / EDIT ROLE */}
            {isRoleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0f1f1b]/80 backdrop-blur-sm" onClick={() => setIsRoleModalOpen(false)}></div>
                    <div className="relative bg-[#1a2f2a] border border-teal-800 shadow-2xl rounded-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-teal-800/50">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                {editingRole ? <Edit2 className="text-teal-400" /> : <Plus className="text-teal-400" />}
                                {editingRole ? "Chỉnh sửa Role" : "Tạo Role Mới"}
                            </h2>
                            <button onClick={() => setIsRoleModalOpen(false)} className="text-teal-200/60 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-teal-100 mb-2">Tên Role</label>
                                <input
                                    type="text"
                                    value={roleForm.name}
                                    onChange={e => setRoleForm({ ...roleForm, name: e.target.value })}
                                    placeholder="Ví dụ: Editor, HR Manager..."
                                    className="w-full bg-[#0f1f1b] border border-teal-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-teal-100 mb-3">Phân Quyền (Permissions)</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {AVAILABLE_PERMISSIONS.map(perm => {
                                        const isChecked = roleForm.permissions.includes(perm.id);
                                        return (
                                            <label
                                                key={perm.id}
                                                className={`flex items-start p-3 rounded-xl cursor-pointer border transition-all ${isChecked ? 'bg-teal-900/40 border-teal-500' : 'bg-[#0f1f1b]/50 border-teal-800/50 hover:border-teal-700'}`}
                                            >
                                                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center mr-3 flex-shrink-0 transition-colors ${isChecked ? 'bg-teal-500 border-teal-500 text-[#0f1f1b]' : 'border-teal-600 bg-transparent'}`}>
                                                    {isChecked && <CheckCircle2 size={14} strokeWidth={3} />}
                                                </div>
                                                <div>
                                                    <div className={`font-medium text-sm ${isChecked ? 'text-teal-300' : 'text-teal-100/80'}`}>{perm.label}</div>
                                                    <div className="text-teal-200/40 text-xs mt-0.5 font-mono">{perm.id}</div>
                                                </div>
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-teal-800/50 flex justify-end gap-3 bg-teal-900/10 rounded-b-2xl">
                            <button
                                onClick={() => setIsRoleModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl font-medium text-teal-200 hover:text-white hover:bg-teal-800/50 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSaveRole}
                                disabled={isSavingRole}
                                className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2
                                    ${isSavingRole ? 'bg-teal-500/50 text-teal-950 cursor-wait' : 'bg-teal-500 hover:bg-teal-400 text-[#0f1f1b] hover:shadow-[0_0_15px_rgba(20,184,166,0.4)]'}
                                `}
                            >
                                {isSavingRole ? (
                                    <div className="w-5 h-5 border-2 border-teal-950 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <CheckCircle2 size={20} />
                                )}
                                {isSavingRole ? "Đang lưu..." : "Lưu Role"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
