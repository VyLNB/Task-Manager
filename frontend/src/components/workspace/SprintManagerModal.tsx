import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import type { Sprint } from '../../interfaces/sprint.ts';
import { createSprint, getSprintsByWorkspace } from '../../services/sprint';

interface SprintManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  onSprintCreated: () => void;
}

export const SprintManagerModal: React.FC<SprintManagerModalProps> = ({ isOpen, onClose, workspaceId, onSprintCreated }) => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSprints();
    }
  }, [isOpen]);

  const fetchSprints = async () => {
    try {
      setLoading(true);
      const res = await getSprintsByWorkspace(workspaceId);
      setSprints(res.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      setCreating(true);
      await createSprint({ name, startDate, endDate, workspaceId });
      setName('');
      setStartDate('');
      setEndDate('');
      setError('');
      await fetchSprints();
      onSprintCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tạo Sprint');
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a2f2a] rounded-3xl w-full max-w-2xl border border-teal-800/50 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-teal-800/50 flex justify-between items-center bg-[#0f1f1b]">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-teal-400" />
            Quản lý Gói thời gian (Sprint)
          </h2>
          <button onClick={onClose} className="text-teal-200/50 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex gap-6">
          <div className="w-1/2 border-r border-teal-800/30 pr-6">
            <h3 className="text-white font-bold mb-4">Tạo Sprint mới</h3>
            {error && <div className="text-red-400 text-sm mb-4 bg-red-400/10 p-2 rounded">{error}</div>}
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-teal-200/60 text-xs mb-1 block">Tên Sprint (VD: Sprint 1)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-[#0f1f1b] text-white border border-teal-700 rounded-xl focus:outline-none focus:border-teal-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-teal-200/60 text-xs mb-1 block">Ngày bắt đầu</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2.5 bg-[#0f1f1b] text-white border border-teal-700 rounded-xl focus:outline-none focus:border-teal-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-teal-200/60 text-xs mb-1 block">Ngày kết thúc</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2.5 bg-[#0f1f1b] text-white border border-teal-700 rounded-xl focus:outline-none focus:border-teal-500 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={creating}
                className="w-full py-2.5 rounded-xl bg-teal-500 text-[#0f1f1b] font-bold hover:bg-teal-400 disabled:opacity-50 transition-colors"
              >
                {creating ? 'Đang tạo...' : 'Tạo Sprint'}
              </button>
            </form>
          </div>

          <div className="w-1/2">
            <h3 className="text-white font-bold mb-4">Danh sách Sprint</h3>
            {loading ? (
              <div className="text-teal-200/60 text-sm">Đang tải...</div>
            ) : sprints.length === 0 ? (
              <div className="text-teal-200/60 text-sm italic">Chưa có Sprint nào</div>
            ) : (
              <div className="space-y-3">
                {sprints.map((sprint) => (
                  <div key={sprint._id} className="bg-[#0f1f1b] p-3 rounded-xl border border-teal-800/30">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-teal-400 font-bold text-sm">{sprint.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${sprint.status === 'Active' ? 'bg-teal-500/20 text-teal-300' : 'bg-gray-500/20 text-gray-300'}`}>
                        {sprint.status}
                      </span>
                    </div>
                    <div className="text-teal-200/50 text-xs">
                      {new Date(sprint.startDate).toLocaleDateString('vi-VN')} - {new Date(sprint.endDate).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
