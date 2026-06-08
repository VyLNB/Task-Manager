import { TaskCard } from './TaskCard';
import { useState } from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Task, Status } from '../../interfaces/task';

export const KanbanColumn = ({
  status,
  title,
  tasks,
  onDrop,
  onDragStart,
}: {
  status: Status;
  title: string;
  tasks: Task[];
  onDrop: (status: Status, taskId: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}) => {
  const [isOver, setIsOver] = useState(false);

  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onDrop(status, taskId);
    }
  };

  const isToDo = status === 'TO DO';
  const isInProgress = status === 'IN PROGRESS';
  const isCompleted = status === 'COMPLETED';

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col gap-4 p-2 rounded-xl transition-colors ${
        isOver ? 'bg-[#18261F]/50' : 'bg-transparent'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isToDo ? 'bg-gray-300' : isInProgress ? 'bg-[#2DD480]' : 'bg-[#2DD480]'
            }`}
          ></div>
          <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
          <span className="bg-[#18261F] text-gray-300 text-xs font-bold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button className="text-gray-400 hover:text-white">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-4 min-h-[150px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
        ))}
      </div>

      {isToDo && (
        <button 
          className="w-full py-3 mt-2 border border-dashed border-[#22352B] text-gray-400 
          rounded-2xl hover:bg-[#18261F] hover:text-white transition-colors flex items-center justify-center gap-2 font-medium text-sm"
          onClick={() => navigate('/todoapp/newTask')}
        >
          <Plus size={18} /> Thêm công việc mới
        </button>
      )}
    </div>
  );
};