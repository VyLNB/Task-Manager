import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from './common/ConfirmDialog';

interface ToDoItemInterface {
  id?: string;
  title: string;
  description: string;
  deadline: string;
  priority: string;
  tags: string[];
}

interface TaskDetailProps {
  initialData?: ToDoItemInterface | null;
  isEditMode?: boolean;
  onSubmit?: (formData: ToDoItemInterface) => void;
  onDelete?: (id: string) => void;
  onCancel?: () => void;
}

const ToDoForm: React.FC<TaskDetailProps> = ({
  initialData,
  isEditMode = false,
  onSubmit,
  onDelete,
  onCancel
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('');
  const [tags, setTags] = useState<string[]>([]);
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
    } else {
      // Reset form khi ở chế độ thêm mới
      setTitle('');
      setDescription('');
      setDeadline('');
      setPriority('');
      setTags([]);
    }
  }, [isEditMode, initialData]);




  const handleSubmit = () => {
    const formData: ToDoItemInterface = {
      ...(isEditMode && initialData?.id ? { id: initialData.id } : {}),
      title,
      description,
      deadline,
      priority,
      tags
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

  // Hàm này được gọi khi user CONFIRM trong dialog
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-white"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-4">
          {isEditMode && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Xóa
            </button>
          )}

          <div className="flex gap-3 ml-auto">
            <button
              type="button"
              onClick={handleCancelClick} // ĐỔI TỪ handleCancel THÀNH handleCancelClick
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 text-white bg-[#2DD480] rounded-md hover:bg-[#2DD480]/80 focus:outline-none focus:ring-2 focus:ring-[#2DD480]/50"
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
        onConfirm={handleConfirmCancel} // ĐỔI TỪ handleCancel THÀNH handleConfirmCancel
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