import { useState } from 'react';
import { CheckSquare, Filter } from 'lucide-react';
import { KanbanBoard } from '../../components/task/KanbanBoard';
import { CreateTaskModal } from '../../components/task/CreateTaskModal';
import { useTasks } from '../../hooks/useTasks';

export default function TaskPage() {
  const { tasks, loading, error, fetchTasks, handleUpdateTaskStatus } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);



  return (
    <div className="min-h-screen bg-[#0D1511] font-sans p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          {/* <p className="text-[#2DD480] text-xs font-bold tracking-wider mb-2">
            FACULTY DASHBOARD <span className="text-gray-500 mx-1">&gt;</span> TASK BOARD
          </p> */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Công việc của bạn</h1>
              <p className="text-gray-400 text-sm">Quản lý các công việc của bạn.</p>
            </div>
            <div className="flex gap-3">
              <button
                className="bg-[#18261F] text-white px-4 py-2 rounded-full 
                          font-semibold text-sm flex items-center 
                          gap-2 hover:bg-[#22352B] transition-colors">
                <Filter size={16} /> Bộ lọc
              </button>
              <button
                className="bg-[#2DD480] text-[#0D1511] px-5 py-2 rounded-full 
                          font-bold text-sm flex items-center gap-2 hover:bg-[#25b56d] transition-colors"
                onClick={() => setIsModalOpen(true)}>
                <CheckSquare size={16} /> Tạo công việc mới
              </button>
            </div>
          </div>
        </div>

        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchTasks}
        />

        <KanbanBoard
          tasks={tasks}
          loading={loading}
          error={error}
          onUpdateTaskStatus={handleUpdateTaskStatus}
        />
      </div>
    </div>
  );
}