// pages/TaskDetail.tsx
import ToDoForm from "../../components/ToDoForm";
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
}

const TaskDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [taskData, setTaskData] = useState<FormDataType | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false); // Thêm trạng thái đang lưu
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
                // Cách 1: Nếu backend có API getById thì dùng cái này sẽ tối ưu hơn
                // const task = await getToDoById(id);
                
                // Cách 2: Dùng getAll như code cũ của bạn
                const allTodos = await getAllToDo();
                const task = allTodos.find((item: ToDoItemInterface) => item._id === id);
                
                if (!task) {
                    setError('Không tìm thấy công việc');
                    setLoading(false);
                    return;
                }
                
                // Format dữ liệu từ API (_id) sang Form (id)
                const formattedData: FormDataType = {
                    id: task._id, // Quan trọng: map _id sang id
                    title: task.title,
                    description: task.description || '',
                    // Các trường dưới API không có, set mặc định để Form không lỗi
                    deadline: '',     
                    priority: '',     
                    tags: []          
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
            setIsSubmitting(true); // Bắt đầu loading
            console.log('Updating task payload:', formData);
            
            // Gọi API update - chỉ gửi title và description theo đúng Interface
            await updateTask(id, { 
                title: formData.title, 
                description: formData.description 
            });
            
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
        // Logic delete (để sau)
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
            <div className="text-red-300 text-center p-8 border border-red-300 rounded m-4">
                <p className="mb-4">{error}</p>
                <button 
                    onClick={() => navigate("/todoapp/tasks")}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
                    {/* Hiển thị lớp phủ khi đang submit để chặn thao tác */}
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