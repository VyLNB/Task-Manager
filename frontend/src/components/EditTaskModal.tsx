import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getToDoById, updateTask } from '../services/task';
import ToDoForm from './TaskForm';
import { X, Clock, History } from 'lucide-react';
import type { ToDoItemInterface, ToDoItemFormData } from '../interfaces/todo';

interface EditTaskModalProps {
    taskId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ taskId, onClose, onSuccess }) => {
    const [task, setTask] = useState<ToDoItemInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');

    useEffect(() => {
        const fetchTask = async () => {
            try {
                setLoading(true);
                const data = await getToDoById(taskId);
                if (data) {
                    setTask(data as any);
                } else {
                    setError("Không tìm thấy công việc");
                }
            } catch (err) {
                console.error(err);
                setError("Lỗi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };
        if (taskId) fetchTask();
    }, [taskId]);

    const handleSubmit = async (formData: any) => {
        try {
            setIsSubmitting(true);
            await updateTask(taskId, {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                dueDate: formData.deadline,
                tags: formData.tags,
                workspaceId: formData.workspaceId,
                status: formData.status,
                sprintId: formData.sprintId,
                estimatedHours: formData.estimatedHours,
                startDate: formData.startDate,
                taskType: formData.taskType,
                assigneeId: formData.assigneeId
            } as any);
            onSuccess();
        } catch (err: any) {
            console.error('Error updating task:', err);
            alert(err.message || "Cập nhật thất bại. Vui lòng thử lại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!taskId) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#0f1f1b] border border-teal-800/50 rounded-2xl shadow-[0_0_40px_rgba(20,184,166,0.15)] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-teal-800/50 bg-[#1a2f2a]/60">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        Chỉnh sửa Công việc
                    </h2>
                    <button onClick={onClose} className="text-teal-400 hover:text-white bg-teal-900/30 hover:bg-teal-800/50 p-2 rounded-xl transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-teal-800/50 bg-[#0f1f1b]">
                    <button 
                        onClick={() => setActiveTab('form')}
                        className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'form' ? 'text-teal-400 border-b-2 border-teal-400 bg-teal-900/10' : 'text-teal-200/60 hover:text-teal-300'}`}
                    >
                        Chi tiết
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-3 font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'history' ? 'text-teal-400 border-b-2 border-teal-400 bg-teal-900/10' : 'text-teal-200/60 hover:text-teal-300'}`}
                    >
                        <History size={18} />
                        Lịch sử chỉnh sửa
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 relative">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-400 text-center p-8 bg-red-500/10 rounded-xl">
                            {error}
                        </div>
                    ) : activeTab === 'form' ? (
                        <div className="relative">
                            {isSubmitting && (
                                <div className="absolute inset-0 bg-[#0f1f1b]/80 z-10 flex items-center justify-center rounded-lg backdrop-blur-sm">
                                    <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-t-transparent border-teal-500"></div>
                                </div>
                            )}

                            <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-start gap-3">
                                <Clock className="text-orange-400 shrink-0 mt-0.5" size={20} />
                                <div className="text-sm text-orange-200/80">
                                    <span className="font-semibold text-orange-400 block mb-1">Lưu ý về thời gian:</span>
                                    Nếu công việc này đã có người log time, mọi thay đổi về <b>Ngày bắt đầu</b>, <b>Hạn chót</b>, hoặc <b>Giờ dự kiến</b> sẽ cần được Quản lý dự án (PM) phê duyệt trước khi áp dụng.
                                </div>
                            </div>

                            <ToDoForm
                                isEditMode={true}
                                initialData={{
                                    id: task?._id,
                                    title: task?.title || '',
                                    description: task?.description || '',
                                    deadline: (task as any).dueDate ? new Date((task as any).dueDate).toISOString().split('T')[0] : '',
                                    priority: (task as any).priority || 'MEDIUM',
                                    tags: (task as any).tags || [],
                                    workspaceId: (task as any).workspaceId?._id || (task as any).workspaceId || '',
                                    estimatedHours: (task as any).estimatedHours || 0,
                                    startDate: (task as any).startDate ? new Date((task as any).startDate).toISOString().split('T')[0] : '',
                                    taskType: (task as any).taskType || 'Planned',
                                    assigneeId: (task as any).assigneeId?._id || (task as any).assigneeId || ''
                                }}
                                onSubmit={handleSubmit}
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {task?.editHistory && task.editHistory.length > 0 ? (
                                task.editHistory.slice().reverse().map((history, idx) => (
                                    <div key={idx} className="p-4 bg-teal-900/10 border border-teal-800/30 rounded-xl">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-medium text-teal-300">
                                                {typeof history.updatedBy === 'string' ? 'Người dùng' : history.updatedBy?.fullName}
                                            </div>
                                            <div className="text-xs text-teal-200/60">
                                                {new Date(history.timestamp).toLocaleString('vi-VN')}
                                            </div>
                                        </div>
                                        <div className="text-sm text-teal-100 mb-2">
                                            <span className="text-teal-200/60">Trường thay đổi: </span>
                                            {history.fieldsChanged.join(', ')}
                                        </div>
                                        {history.note && (
                                            <div className="text-sm text-orange-300 italic bg-orange-900/20 p-2 rounded-lg inline-block">
                                                {history.note}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-teal-200/60">
                                    Chưa có lịch sử chỉnh sửa nào.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default EditTaskModal;
