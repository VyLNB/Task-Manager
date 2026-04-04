import React, { useEffect, useState } from 'react';
import { CheckSquare, Filter } from 'lucide-react';
import { KanbanColumn } from './KanbanColumn';
import { getAllToDo, updateTask } from '../../services/todo';
import { useNavigate } from 'react-router-dom';

export type Priority = 'HIGH PRIORITY' | 'MEDIUM PRIORITY' | 'LOW PRIORITY';
export type Status = 'TO DO' | 'IN PROGRESS' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  date: string;
  tags: string[];
  progress?: number;
  completedSubtasks?: number;
  totalSubtasks?: number;
}

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  
  
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('taskId', id);
  };

  // thả task vào cột mới, cập nhật trạng thái của task đó
  const handleDrop = async (newStatus: Status, taskId: string) => {
    if (!taskId) return;
    const previousTasks = [...tasks];

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    try {
      await updateTask(taskId, { status: newStatus } as any); 
    } catch (error) {
      console.error('Failed to update task status:', error);
      setError('Failed to update task status. Please try again.');
      // Rollback lại state cũ nếu gọi API thất bại
      setTasks(previousTasks);
      alert("Không thể cập nhật trạng thái, vui lòng thử lại!");
    }
  };

const fetchTasks = async () => {
  try {
    setLoading(true);
    const data = await getAllToDo();

    const convertedTasks: Task[] = data.map((item: any) => { 
      const dateObj = new Date(item.createdAt);
      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      let currentStatus = item.status;
      if (!currentStatus) {
         currentStatus = item.completed ? 'COMPLETED' : 'TO DO';
      }

      return {
        id: item._id,
        title: item.title,
        status: currentStatus, 
        priority: 'MEDIUM PRIORITY', 
        date: formattedDate,
        tags: ['API TASK'], 
        completedSubtasks: currentStatus === 'COMPLETED' ? 1 : 0,
        totalSubtasks: 1,
      };
    });
      
    setTasks(convertedTasks);
    setError(null);
  } catch (error) {
    setError('Failed to fetch tasks');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-[#0D1511] font-sans p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <p className="text-[#2DD480] text-xs font-bold tracking-wider mb-2">
            FACULTY DASHBOARD <span className="text-gray-500 mx-1">&gt;</span> TASK BOARD
          </p>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Task Management</h1>
              <p className="text-gray-400 text-sm">Manage your academic priorities and deadlines.</p>
            </div>
            <div className="flex gap-3">
              <button 
                className="bg-[#18261F] text-white px-4 py-2 rounded-full 
                          font-semibold text-sm flex items-center 
                          gap-2 hover:bg-[#22352B] transition-colors">
                <Filter size={16} /> Filter
              </button>
              <button 
                className="bg-[#2DD480] text-[#0D1511] px-5 py-2 rounded-full 
                          font-bold text-sm flex items-center gap-2 hover:bg-[#25b56d] transition-colors"
                onClick={() => navigate('/todoapp/newTask')}>
                <CheckSquare size={16} /> Create New Task
              </button>
            </div>
          </div>
        </div>

        {/* Loading và Error States */}
        {loading && <p className="text-[#2DD480] mb-4">Loading tasks...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Kanban Board Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KanbanColumn
            title="TO DO"
            tasks={tasks.filter((t) => t.status === 'TO DO')}
            onDragStart={handleDragStart}
            onDrop={handleDrop} 
          />
          <KanbanColumn
            title="IN PROGRESS"
            tasks={tasks.filter((t) => t.status === 'IN PROGRESS')}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
          <KanbanColumn
            title="COMPLETED"
            tasks={tasks.filter((t) => t.status === 'COMPLETED')}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        </div>
      </div>
    </div>
  );
}