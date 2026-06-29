import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { Task } from '../../interfaces/task';
import { Calendar, CheckSquare, CheckCircle2, Edit, Clock } from 'lucide-react';
import { LogTimeModal } from './LogTimeModal';
export const TaskCard = ({
  task,
  onDragStart,
}: {
  task: Task;
  onDragStart: (e: React.DragEvent, id: string) => void;
}) => {
  const isCompleted = task.status === 'COMPLETED';
  const navigate = useNavigate();
  const [isLogTimeOpen, setIsLogTimeOpen] = useState(false);

  // Kiểm tra quyền chỉnh sửa
  const userString = localStorage.getItem('user');
  const userObj = userString ? JSON.parse(userString) : null;
  const currentUserId = userObj?.user?.id;
  const isPM = userObj?.user?.role?.name === 'Project Manager';

  const canEdit = isPM || task.creatorId === currentUserId || task.assigneeId === currentUserId;

  return (
    <div
      draggable={canEdit}
      onDragStart={(e) => canEdit && onDragStart(e, task.id)}
      className={`bg-[#1a2f2a]/60 backdrop-blur-md p-4 rounded-2xl border ${task.status === 'IN PROGRESS' && task.id === '3'
        ? 'border-teal-400'
        : 'border-teal-800/50'
        } ${canEdit ? 'cursor-grab active:cursor-grabbing hover:border-teal-400/50 hover:bg-[#1a2f2a]/80' : 'cursor-not-allowed opacity-80'} transition-colors shadow-xl`}
    >
      {/* Header Card: Priority & Date */}
      <div className="flex justify-between items-center mb-3">
        <span
          className={`text-[10px] font-bold px-2 py-1 rounded-md ${task.priority === 'HIGH PRIORITY'
            ? 'bg-[#FF4D4D]/10 text-[#FF4D4D]'
            : task.priority === 'MEDIUM PRIORITY'
              ? 'bg-teal-500/10 text-teal-400'
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
        {task.tags.map((tag: any) => (
          <span key={tag} className="bg-[#0f1f1b] border border-teal-800/50 text-teal-300 text-[10px] font-medium px-2 py-1 rounded-md">
            {tag}
          </span>
        ))}
      </div>

      {/* Progress Bar (Only for In Progress) */}
      {task.progress !== undefined && !isCompleted && (
        <div className="mb-4">
          <div className="flex justify-between text-[10px] font-semibold text-gray-400 mb-1.5">
            <span>PROGRESS</span>
            <span className="text-teal-400">{task.progress}%</span>
          </div>
          <div className="w-full bg-[#0f1f1b] rounded-full h-1.5">
            <div
              className="bg-teal-500 h-1.5 rounded-full"
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Footer: Avatars & Subtasks */}
      <div className="mt-auto pt-4 border-t border-teal-800/30 flex flex-col gap-3">
        {/* Assignee & Subtasks Row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {task.assignee ? (
              <div className="flex items-center gap-2" title={task.assignee.email}>
                <div className="w-6 h-6 rounded-full bg-teal-600 border border-teal-800 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  {task.assignee.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-teal-100 truncate max-w-[120px]" title={task.assignee.fullName}>{task.assignee.fullName}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2" title="Chưa phân công">
                <div className="w-6 h-6 rounded-full bg-gray-600 border border-gray-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  ?
                </div>
                <span className="text-xs text-gray-400">Chưa phân công</span>
              </div>
            )}
          </div>
          <div className={`flex items-center text-xs font-semibold ${isCompleted ? 'text-teal-400' : 'text-gray-400'}`}>
            {isCompleted ? (
              <span className="bg-teal-500/10 text-teal-400 px-2 py-1 rounded-md flex items-center">
                <CheckCircle2 size={12} className="mr-1" /> Hoàn thành
              </span>
            ) : (
              <>
                <CheckSquare size={14} className="mr-1" />
                {task.completedSubtasks}/{task.totalSubtasks}
              </>
            )}
          </div>
        </div>

        {/* Action Row */}
        <div className="flex gap-2">
          {canEdit ? (
            <button className="flex-[2] bg-teal-500/10 text-teal-400 border border-teal-500/30 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-teal-500 hover:text-[#0f1f1b] transition-colors"
              onClick={() => navigate(`/main/tasks/${task.id}`)}>
              <Edit size={14} /> Chỉnh sửa / Chi tiết
            </button>
          ) : (
            <button className="flex-[2] bg-gray-500/10 text-gray-400 border border-gray-500/30 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-600/30 transition-colors"
              onClick={() => navigate(`/main/tasks/${task.id}`)}>
              Chi tiết
            </button>
          )}

          {canEdit && task.workspaceId && (
            <button 
              className={`flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center transition-colors ${
                task.myTimesheet 
                  ? 'bg-teal-500 text-[#0f1f1b] hover:bg-teal-400' 
                  : (isPM && task.hasAnyTimesheet ? 'bg-teal-700/50 text-teal-200 border border-teal-500/50 hover:bg-teal-600/50' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-[#0f1f1b]')
              }`}
              onClick={() => setIsLogTimeOpen(true)}
              title={task.myTimesheet ? "Xem/Sửa Timesheet của bạn" : (isPM && task.hasAnyTimesheet ? "Member Đã Log - Bấm để log thêm của bạn" : "Log Time")}
            >
              <Clock size={16} />
              {task.myTimesheet ? <span className="ml-1">Đã Log</span> : (isPM && task.hasAnyTimesheet ? <span className="ml-1">Member Đã Log</span> : <span className="ml-1">Log Time</span>)}
            </button>
          )}
        </div>
      </div>

      {task.workspaceId && (
        <LogTimeModal
            isOpen={isLogTimeOpen}
            onClose={() => setIsLogTimeOpen(false)}
            task={task}
            workspaceId={task.workspaceId}
            onSuccess={() => {
                // Optional: show toast notification
                setIsLogTimeOpen(false);
                window.dispatchEvent(new Event('task_updated'));
            }}
        />
      )}
    </div>
  );
};