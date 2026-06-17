import { useState } from 'react';
import { CheckSquare, Filter } from 'lucide-react';
import { KanbanBoard } from '../../components/task/KanbanBoard';
import { CreateTaskModal } from '../../components/task/CreateTaskModal';
import { useTasks } from '../../hooks/useTasks';

export default function TaskPage() {
  const { tasks, loading, error, fetchTasks, handleUpdateTaskStatus } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);



  return (
    <div className="min-h-screen bg-[#0f1f1b] font-sans p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          {/* <p className="text-[#2DD480] text-xs font-bold tracking-wider mb-2">
            FACULTY DASHBOARD <span className="text-gray-500 mx-1">&gt;</span> TASK BOARD
          </p> */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Công việc của bạn</h1>
              <p className="text-teal-200/60 text-sm">Quản lý các công việc của bạn.</p>
            </div>
            <div className="flex gap-3">
              <button
                className="bg-[#1a2f2a] text-teal-200 border border-teal-800/50 px-4 py-2 rounded-full 
                          font-semibold text-sm flex items-center 
                          gap-2 hover:bg-teal-900/40 transition-colors">
                <Filter size={16} /> Bộ lọc
              </button>
              <button
                className="bg-teal-500 text-[#0f1f1b] px-5 py-2 rounded-full 
                          font-bold text-sm flex items-center gap-2 hover:bg-teal-400 transition-colors shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_20px_rgba(20,184,166,0.5)]"
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