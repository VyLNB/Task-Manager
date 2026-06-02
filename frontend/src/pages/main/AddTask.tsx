import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ToDoForm from '../../components/ToDoForm';
import { createTask } from '../../services/todo';
import { getWorkspaces } from '../../services/workspace';
import type { ToDoItemFormData } from '../../interfaces/todo';
import type { WorkspaceInterface } from '../../interfaces/workspace';

interface ToDoFormItem {
    id?: string;
    title: string;
    description: string;
    deadline: string;
    priority: string;
    tags: string[];
    workspaceId?: string;
}

const AddTask = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [workspaces, setWorkspaces] = useState<WorkspaceInterface[]>([]);

    useEffect(() => {
        getWorkspaces().then(res => setWorkspaces(res.data || [])).catch(console.error);
    }, []);

    const handleSubmit = async (formData: ToDoFormItem) => {
        try {
            setIsSubmitting(true);
            
            const payload: ToDoItemFormData = {
                title: formData.title,
                description: formData.description,
                status: 'TO DO', 
                workspaceId: formData.workspaceId
            };

            console.log('Creating task:', payload);
            await createTask(payload);
            
            navigate("/todoapp/tasks");
            
        } catch (error) {
            console.error('Error creating task:', error);
            alert("Có lỗi xảy ra khi tạo công việc mới!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate("/todoapp/tasks");
    };

    return (
        <div className="text-white relative">
            {/* Loading Overlay */}
            {isSubmitting && (
                <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            )}

            <ToDoForm 
                isEditMode={false} 
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                workspaces={workspaces}
            />
        </div>
    );
};

export default AddTask;