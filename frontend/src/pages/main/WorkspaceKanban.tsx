import { useState, useEffect } from 'react';
import { CheckSquare, User, Sparkles } from 'lucide-react';
import { KanbanBoard } from '../../components/task/KanbanBoard';
import { WorkspaceTimesheets } from '../../components/workspace/WorkspaceTimesheets';
import { CreateTaskModal } from '../../components/task/CreateTaskModal';
import { InviteMemberModal } from '../../components/workspace/InviteMemberModal';
import { SprintManagerModal } from '../../components/workspace/SprintManagerModal';
import { AIEvaluationModal } from '../../components/workspace/AIEvaluationModal';
import { useTasks } from '../../hooks/useTasks';
import { usePermission } from '../../hooks/usePermission';
import { useParams } from 'react-router-dom';
import { inviteMember } from '../../services/workspace';
import { getSprintsByWorkspace } from '../../services/sprint';
import type { Sprint } from '../../interfaces/sprint.ts';

export default function WorkspaceKanban() {
  const { id: workspaceId } = useParams<{ id: string }>();
  const { tasks, loading, error, fetchTasks, handleUpdateTaskStatus } = useTasks(workspaceId);
  const { isProjectManager } = usePermission();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'kanban' | 'timesheet'>('kanban');
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprintId, setSelectedSprintId] = useState<string>('all');

  // Fetch sprints
  const fetchSprints = async () => {
    if (!workspaceId) return;
    try {
      const res = await getSprintsByWorkspace(workspaceId);
      setSprints(res.data);
    } catch (error) {
      console.error("Lỗi khi tải Sprints:", error);
    }
  };

  useEffect(() => {
    fetchSprints();
  }, [workspaceId]);

  const filteredTasks = selectedSprintId === 'all' 
    ? tasks 
    : tasks.filter(task => task.sprintId === selectedSprintId);

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
                  onClick={() => setIsSprintModalOpen(true)}
                  className="bg-[#1a2f2a] text-teal-200 px-4 py-2 rounded-full border border-teal-800/50 
                            font-semibold text-sm hover:bg-teal-900/40 transition-colors">
                  Quản lý Sprint
                </button>
              )}
              {isProjectManager && (
                <button 
                  onClick={() => setIsAIModalOpen(true)}
                  className="bg-[#1a2f2a] text-teal-200 px-4 py-2 rounded-full border border-teal-800/50 
                            font-semibold text-sm flex items-center 
                            gap-2 hover:bg-teal-900/40 transition-colors">
                  <Sparkles size={16} className="text-teal-400" /> Đánh giá AI
                </button>
              )}
              {isProjectManager && (
                <button 
                  onClick={() => setIsInviteModalOpen(true)}
                  className="bg-[#1a2f2a] text-teal-200 px-4 py-2 rounded-full border border-teal-800/50 
                            font-semibold text-sm flex items-center 
                            gap-2 hover:bg-teal-900/40 transition-colors">
                  <User size={16} /> Mời thành viên
                </button>
              )}
              {activeTab === 'kanban' && (
                <button 
                  className="bg-teal-500 text-[#0f1f1b] px-5 py-2 rounded-full 
                            font-bold text-sm flex items-center gap-2 hover:bg-teal-400 transition-colors shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_20px_rgba(20,184,166,0.5)]"
                  onClick={() => setIsModalOpen(true)}>
                  <CheckSquare size={16} /> Tạo công việc mới
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 border-b border-teal-800/50 pb-2">
            <div className="flex gap-4">
              <button
                  className={`px-4 py-2 font-bold text-sm rounded-t-lg transition-colors ${activeTab === 'kanban' ? 'text-teal-400 border-b-2 border-teal-400 bg-teal-900/20' : 'text-teal-200/50 hover:text-teal-200'}`}
                  onClick={() => setActiveTab('kanban')}
              >
                  Kanban Board
              </button>
              {isProjectManager && (
                  <button
                      className={`px-4 py-2 font-bold text-sm rounded-t-lg transition-colors ${activeTab === 'timesheet' ? 'text-teal-400 border-b-2 border-teal-400 bg-teal-900/20' : 'text-teal-200/50 hover:text-teal-200'}`}
                      onClick={() => setActiveTab('timesheet')}
                  >
                      Kiểm duyệt Timesheets
                  </button>
              )}
            </div>
            
            {activeTab === 'kanban' && sprints.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-teal-200/60 text-sm">Lọc theo Sprint:</span>
                <select 
                  value={selectedSprintId}
                  onChange={(e) => setSelectedSprintId(e.target.value)}
                  className="bg-[#1a2f2a] text-teal-200 border border-teal-800/50 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-teal-500"
                >
                  <option value="all">Tất cả</option>
                  {sprints.map(sprint => (
                    <option key={sprint._id} value={sprint._id}>{sprint.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <CreateTaskModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={fetchTasks} 
            workspaceId={workspaceId}
            sprints={sprints}
        />

        <SprintManagerModal
            isOpen={isSprintModalOpen}
            onClose={() => setIsSprintModalOpen(false)}
            workspaceId={workspaceId || ''}
            onSprintCreated={fetchSprints}
        />

        <AIEvaluationModal
            isOpen={isAIModalOpen}
            onClose={() => setIsAIModalOpen(false)}
            workspaceId={workspaceId || ''}
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

        {activeTab === 'kanban' ? (
            <KanbanBoard 
                tasks={filteredTasks} 
                loading={loading} 
                error={error} 
                onUpdateTaskStatus={handleUpdateTaskStatus} 
                onOpenCreateModal={() => setIsModalOpen(true)}
            />
        ) : (
            workspaceId && <WorkspaceTimesheets workspaceId={workspaceId} />
        )}
      </div>
    </div>
  );
}
