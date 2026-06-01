import React, { useState } from 'react';
import ToDoForm from '../ToDoForm';
import { createTask } from '../../services/todo';
import type { ToDoItemFormData } from '../../interfaces/todo';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    workspaceId?: string;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onSuccess, workspaceId }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (formData: any) => {
        try {
            setIsSubmitting(true);
            const payload: ToDoItemFormData = {
                title: formData.title,
                description: formData.description,
                status: 'TO DO',
                workspaceId: workspaceId,
            };
            await createTask(payload);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating task:', error);
            alert("Có lỗi xảy ra khi tạo công việc mới!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-[#18261F] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl border border-gray-700">
                {isSubmitting && (
                    <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center rounded-xl">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2DD480]"></div>
                    </div>
                )}
                
                <ToDoForm 
                    isEditMode={false} 
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                />
            </div>
        </div>
    );
};
