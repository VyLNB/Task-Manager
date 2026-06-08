import { useState } from 'react';
import { CheckSquare, User } from 'lucide-react';
import { KanbanBoard } from '../../components/task/KanbanBoard';
import { CreateTaskModal } from '../../components/task/CreateTaskModal';
import { InviteMemberModal } from '../../components/workspace/InviteMemberModal';
import { useTasks } from '../../hooks/useTasks';
import { useParams } from 'react-router-dom';
import { inviteMember } from '../../services/workspace';

export default function WorkspaceKanban() {
  const { id: workspaceId } = useParams<{ id: string }>();
  const { tasks, loading, error, fetchTasks, handleUpdateTaskStatus } = useTasks(workspaceId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0D1511] font-sans p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <p className="text-[#2DD480] text-xs font-bold tracking-wider mb-2">
            WORKSPACE <span className="text-gray-500 mx-1">&gt;</span> KANBAN BOARD
          </p>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Workspace Tasks</h1>
              <p className="text-gray-400 text-sm">Quản lý các công việc trong Workspace này.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-[#18261F] text-white px-4 py-2 rounded-full 
                          font-semibold text-sm flex items-center 
                          gap-2 hover:bg-[#22352B] transition-colors">
                <User size={16} /> Invite Member
              </button>
              <button 
                className="bg-[#2DD480] text-[#0D1511] px-5 py-2 rounded-full 
                          font-bold text-sm flex items-center gap-2 hover:bg-[#25b56d] transition-colors"
                onClick={() => setIsModalOpen(true)}>
                <CheckSquare size={16} /> Create New Task
              </button>
            </div>
          </div>
        </div>

        <CreateTaskModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={fetchTasks} 
            workspaceId={workspaceId}
        />

        <InviteMemberModal
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
            onInvite={async (email) => {
                if (!workspaceId) return;
                await inviteMember(workspaceId, email);
                // Bạn có thể reload data ở đây nếu cần, ví dụ: gọi lại API getWorkspace
                alert('Mời thành viên thành công!');
            }}
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
