import React, { useState, useEffect } from 'react';
import ToDoForm from '../TaskForm';
import { createTask } from '../../services/todo';
import { getWorkspaces } from '../../services/workspace';
import type { ToDoItemFormData } from '../../interfaces/todo';
import type { WorkspaceInterface } from '../../interfaces/workspace';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    workspaceId?: string;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onSuccess, workspaceId }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [workspaces, setWorkspaces] = useState<WorkspaceInterface[]>([]);

    useEffect(() => {
        if (isOpen) {
            getWorkspaces().then(res => setWorkspaces(res.data || [])).catch(console.error);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (formData: any) => {
        try {
            setIsSubmitting(true);
            const payload: ToDoItemFormData = {
                title: formData.title,
                description: formData.description,
                status: 'TO DO',
                workspaceId: formData.workspaceId || workspaceId,
                assigneeId: formData.assigneeId,
                priority: formData.priority
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
            <div className="bg-[#1a2f2a] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl border border-teal-800">
                {isSubmitting && (
                    <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center rounded-xl">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                    </div>
                )}

                <ToDoForm
                    isEditMode={false}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                    workspaces={workspaces}
                    workspaceId={workspaceId}
                />
            </div>
        </div>
    );
};
