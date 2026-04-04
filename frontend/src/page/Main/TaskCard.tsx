import type { Task } from './TasksPage';
import { Calendar, CheckSquare, CheckCircle2 } from 'lucide-react';
export const TaskCard = ({
  task,
  onDragStart,
}: {
  task: Task;
  onDragStart: (e: React.DragEvent, id: string) => void;
}) => {
  const isCompleted = task.status === 'COMPLETED';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className={`bg-[#18261F] p-4 rounded-2xl cursor-grab active:cursor-grabbing border ${
        task.status === 'IN PROGRESS' && task.id === '3' 
          ? 'border-[#2DD480]' 
          : 'border-[#22352B]'
      } hover:border-[#2DD480]/50 transition-colors shadow-sm`}
    >
      {/* Header Card: Priority & Date */}
      <div className="flex justify-between items-center mb-3">
        <span
          className={`text-[10px] font-bold px-2 py-1 rounded-md ${
            task.priority === 'HIGH PRIORITY'
              ? 'bg-[#FF4D4D]/10 text-[#FF4D4D]'
              : task.priority === 'MEDIUM PRIORITY'
              ? 'bg-[#2DD480]/10 text-[#2DD480]'
              : 'bg-gray-500/10 text-gray-400'
          }`}
        >
          {task.priority}
        </span>
        <div className="flex items-center text-gray-400 text-xs">
          {isCompleted ? <CheckCircle2 size={14} className="mr-1" /> : <Calendar size={14} className="mr-1" />}
          {isCompleted ? 'Done' : task.date}
        </div>
      </div>

      {/* Title */}
      <h4 className={`text-[15px] font-semibold mb-3 leading-snug ${isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>
        {task.title}
      </h4>

      {/* Tags */}
      <div className="flex gap-2 mb-4">
        {task.tags.map((tag) => (
          <span key={tag} className="bg-[#22352B] text-[#A3B8AD] text-[10px] font-medium px-2 py-1 rounded-md">
            {tag}
          </span>
        ))}
      </div>

      {/* Progress Bar (Only for In Progress) */}
      {task.progress !== undefined && !isCompleted && (
        <div className="mb-4">
          <div className="flex justify-between text-[10px] font-semibold text-gray-400 mb-1.5">
            <span>PROGRESS</span>
            <span className="text-[#2DD480]">{task.progress}%</span>
          </div>
          <div className="w-full bg-[#111A15] rounded-full h-1.5">
            <div
              className="bg-[#2DD480] h-1.5 rounded-full"
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Footer: Avatars & Subtasks */}
      <div className="flex justify-between items-center mt-auto">
        <div className="flex -space-x-2">
          {/* Fake Avatars */}
          <div className="w-6 h-6 rounded-full bg-blue-500 border border-[#18261F]"></div>
          <div className="w-6 h-6 rounded-full bg-purple-500 border border-[#18261F]"></div>
        </div>
        <div className={`flex items-center text-xs font-semibold ${isCompleted ? 'text-[#2DD480]' : 'text-gray-400'}`}>
          {isCompleted ? (
            <span className="bg-[#2DD480]/10 px-2 py-1 rounded-md flex items-center">
              <CheckCircle2 size={12} className="mr-1" /> All Done
            </span>
          ) : (
            <>
              <CheckSquare size={14} className="mr-1" />
              {task.completedSubtasks}/{task.totalSubtasks}
            </>
          )}
        </div>
      </div>
    </div>
  );
};