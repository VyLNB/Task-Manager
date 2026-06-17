// pages/TaskDetail.tsx
import ToDoForm from "../../components/TaskForm";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllToDo, updateTask } from "../../services/todo";
import type { ToDoItemInterface } from "../../interfaces/todo";

// Interface nội bộ để match với props của ToDoForm
interface FormDataType {
    id?: string;
    title: string;
    description: string;
    deadline: string;
    priority: string;
    tags: string[];
    workspaceId?: string;
}

const TaskDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [taskData, setTaskData] = useState<FormDataType | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTaskDetail = async () => {
            if (!id) {
                setError('Không tìm thấy ID công việc');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const allTodos = await getAllToDo();
                const task = allTodos.find((item: ToDoItemInterface) => item._id === id);

                if (!task) {
                    setError('Không tìm thấy công việc');
                    setLoading(false);
                    return;
                }

                const formattedData: FormDataType = {
                    id: task._id,
                    title: task.title,
                    description: task.description || '',
                    deadline: (task as any).dueDate ? new Date((task as any).dueDate).toISOString().split('T')[0] : '',
                    priority: (task as any).priority || 'MEDIUM',
                    tags: (task as any).tags || [],
                    workspaceId: (task as any).workspaceId || ''
                };

                setTaskData(formattedData);
                setError(null);
            } catch (err) {
                console.error('Error fetching task detail:', err);
                setError('Không thể tải thông tin công việc');
            } finally {
                setLoading(false);
            }
        };

        fetchTaskDetail();
    }, [id]);

    // Hàm xử lý khi user bấm nút Cập nhật/Lưu
    const handleSubmit = async (formData: FormDataType) => {
        if (!id) return;

        try {
            setIsSubmitting(true);
            console.log('Updating task payload:', formData);

            await updateTask(id, {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                dueDate: formData.deadline,
                tags: formData.tags,
                workspaceId: formData.workspaceId
            } as any);

            // Thành công thì quay về trang danh sách
            navigate("/todoapp/tasks");
        } catch (err) {
            console.error('Error updating task:', err);
            alert("Cập nhật thất bại. Vui lòng thử lại!");
        } finally {
            setIsSubmitting(false); // Kết thúc loading
        }
    };

    const handleDelete = async (taskId: string) => {
        console.log("Delete requested for:", taskId);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-2"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-400 text-center p-8 border border-red-500/30 bg-red-500/10 rounded-xl m-4">
                <p className="mb-4">{error}</p>
                <button
                    onClick={() => navigate("/todoapp/tasks")}
                    className="px-4 py-2 bg-red-500/20 text-red-500 border border-red-500/50 rounded-xl hover:bg-red-500/30 font-medium transition-colors"
                >
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    return (
        <div className="text-white">
            {taskData && (
                <div className="relative">
                    {isSubmitting && (
                        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center rounded-lg">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    )}

                    <ToDoForm
                        isEditMode={true}
                        initialData={taskData}
                        onSubmit={handleSubmit}
                        onDelete={handleDelete}
                    />
                </div>
            )}
        </div>
    );
};

export default TaskDetail;