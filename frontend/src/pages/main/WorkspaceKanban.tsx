import { useState } from 'react';
import { CheckSquare, User } from 'lucide-react';
import { KanbanBoard } from '../../components/task/KanbanBoard';
import { CreateTaskModal } from '../../components/task/CreateTaskModal';
import { InviteMemberModal } from '../../components/workspace/InviteMemberModal';
import { useTasks } from '../../hooks/useTasks';
import { usePermission } from '../../hooks/usePermission';
import { useParams } from 'react-router-dom';
import { inviteMember } from '../../services/workspace';

export default function WorkspaceKanban() {
  const { id: workspaceId } = useParams<{ id: string }>();
  const { tasks, loading, error, fetchTasks, handleUpdateTaskStatus } = useTasks(workspaceId);
  const { isProjectManager } = usePermission();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f1f1b] font-sans p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          {/* <p className="text-teal-400 text-xs font-bold tracking-wider mb-2">
            WORKSPACE <span className="text-teal-200/40 mx-1">&gt;</span> KANBAN BOARD
          </p> */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Bảng công việc</h1>
              <p className="text-teal-200/60 text-sm">Quản lý các công việc trong Workspace này.</p>
            </div>
            <div className="flex gap-3">
              {isProjectManager && (
                <button 
                  onClick={() => setIsInviteModalOpen(true)}
                  className="bg-[#1a2f2a] text-teal-200 px-4 py-2 rounded-full border border-teal-800/50 
                            font-semibold text-sm flex items-center 
                            gap-2 hover:bg-teal-900/40 transition-colors">
                  <User size={16} /> Mời thành viên
                </button>
              )}
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
            workspaceId={workspaceId}
        />

        <InviteMemberModal
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
            onInvite={async (email) => {
                if (!workspaceId) return;
                await inviteMember(workspaceId, email);
                alert('Mời thành viên thành công!');
            }}
        />

        <KanbanBoard 
            tasks={tasks} 
            loading={loading} 
            error={error} 
            onUpdateTaskStatus={handleUpdateTaskStatus} 
            onOpenCreateModal={() => setIsModalOpen(true)}
        />
      </div>
    </div>
  );
}
