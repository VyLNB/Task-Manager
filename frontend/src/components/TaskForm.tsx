import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from './common/ConfirmDialog';
import type { WorkspaceInterface } from '../interfaces/workspace';

interface ToDoItemInterface {
  id?: string;
  title: string;
  description: string;
  deadline: string;
  priority: string;
  tags: string[];
  workspaceId?: string;
  assigneeId?: string;
}

interface TaskDetailProps {
  initialData?: ToDoItemInterface | null;
  isEditMode?: boolean;
  workspaces?: WorkspaceInterface[];
  workspaceId?: string;
  onSubmit?: (formData: ToDoItemInterface) => void;
  onDelete?: (id: string) => void;
  onCancel?: () => void;
}

const ToDoForm: React.FC<TaskDetailProps> = ({
  initialData,
  isEditMode = false,
  workspaces = [],
  workspaceId: initialWorkspaceId,
  onSubmit,
  onDelete,
  onCancel
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [workspaceId, setWorkspaceId] = useState<string>('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Load dữ liệu khi ở chế độ edit
  useEffect(() => {
    if (isEditMode && initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setDeadline(initialData.deadline || '');
      setPriority(initialData.priority || '');
      setTags(initialData.tags || []);
      setWorkspaceId(initialData.workspaceId || initialWorkspaceId || '');
      setAssigneeId(initialData.assigneeId || '');
    } else {
      // Reset form khi ở chế độ thêm mới
      setTitle('');
      setDescription('');
      setDeadline('');
      setPriority('');
      setTags([]);
      setWorkspaceId(initialWorkspaceId || '');
      setAssigneeId('');
    }
  }, [isEditMode, initialData, initialWorkspaceId]);

  const selectedWorkspace = workspaces.find(ws => ws._id === workspaceId);




  const handleSubmit = () => {
    const formData: ToDoItemInterface = {
      ...(isEditMode && initialData?.id ? { id: initialData.id } : {}),
      title,
      description,
      deadline,
      priority,
      tags,
      workspaceId,
      assigneeId: workspaceId ? assigneeId : undefined
    };

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleDelete = () => {
    if (isEditMode && initialData?.id && onDelete) {
      onDelete(initialData.id);
    }
  };

  // Hàm này chỉ MỞ dialog, không navigate
  const handleCancelClick = () => {
    setIsCancelDialogOpen(true);
  };

  // Hàm này được gọi khi user confirm trong dialog
  const handleConfirmCancel = () => {
    setIsCancelDialogOpen(false);
    if (onCancel) {
      onCancel();
    } else {
      navigate("/todoapp/tasks");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white">
            {isEditMode ? 'Chỉnh sửa công việc' : 'Tạo công việc mới'}
          </h2>
        </div>

        {/* Workspace */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Workspace
          </label>
          <select
            value={workspaceId}
            onChange={(e) => setWorkspaceId(e.target.value)}
            disabled={!!initialWorkspaceId}
            className="w-full px-3 py-2 border border-teal-700 rounded-md focus:outline-none 
                        focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-white bg-[#0f1f1b] disabled:opacity-60"
          >
            <option value="">-- Công việc cá nhân --</option>
            {workspaces.map(ws => (
              <option key={ws._id} value={ws._id}>{ws.name}</option>
            ))}
          </select>
        </div>

        {/* Assignee (Chỉ hiện khi thuộc Workspace) */}
        {workspaceId && selectedWorkspace && (
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Người thực hiện
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-3 py-2 border border-teal-700 rounded-md focus:outline-none 
                          focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-white bg-[#0f1f1b]"
            >
              <option value="">-- Chọn thành viên --</option>
              {selectedWorkspace.members.map(member => (
                <option key={member._id} value={member._id}>{member.fullName} ({member.email})</option>
              ))}
            </select>
          </div>
        )}

        {/* Tiêu đề */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Tiêu đề
          </label>
          <input
            type="text"
            placeholder="Nhập tên công việc..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-teal-700 bg-[#0f1f1b] rounded-md focus:outline-none 
                        focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-white"
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Mô tả
          </label>
          <textarea
            placeholder="Mô tả chi tiết công việc, tài liệu liên quan..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-teal-700 bg-[#0f1f1b] rounded-md focus:outline-none 
                      focus:ring-1 focus:ring-teal-500 focus:border-teal-500 resize-none text-white"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-4">
          {isEditMode && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-2 text-red-500 bg-red-500/10 border border-red-500/50 rounded-xl hover:bg-red-500/20 font-medium transition-colors focus:outline-none"
            >
              Xóa
            </button>
          )}

          <div className="flex gap-3 ml-auto">
            <button
              type="button"
              onClick={handleCancelClick}
              className="px-6 py-2 rounded-xl font-medium text-teal-200/60 hover:text-white hover:bg-teal-800/50 transition-colors focus:outline-none"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#0f1f1b] font-bold transition-colors shadow-[0_0_15px_rgba(20,184,166,0.3)] focus:outline-none"
            >
              {isEditMode ? 'Cập nhật' : 'Tạo công việc'}
            </button>
          </div>
        </div>
      </div>

      {/* Dialog xác nhận hủy */}
      <ConfirmDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleConfirmCancel} 
        title="Rời khỏi trang?"
        message="Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời khỏi trang này không?"
        confirmText="Rời đi"
        cancelText="Ở lại"
        variant="warning"
      />
    </div>
  );
};

export default ToDoForm;