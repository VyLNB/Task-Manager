import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Clock, FileText, CheckCircle, Edit3 } from 'lucide-react';
import { createTimesheet, updateTimesheet } from '../../services/timesheet';
import type { Task } from '../../interfaces/task';

interface LogTimeModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task;
    workspaceId: string;
    onSuccess: () => void;
}

export const LogTimeModal: React.FC<LogTimeModalProps> = ({
    isOpen,
    onClose,
    task,
    workspaceId,
    onSuccess
}) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('17:00');
    const [hours, setHours] = useState(0);
    const [description, setDescription] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Tính toán số giờ làm việc tự động
    useEffect(() => {
        if (startTime && endTime) {
            const start = new Date(`2000-01-01T${startTime}`);
            const end = new Date(`2000-01-01T${endTime}`);
            let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            
            // Nếu qua ngày hôm sau
            if (diff < 0) diff += 24;
            
            // Làm tròn đến 2 chữ số thập phân
            setHours(Math.round(diff * 100) / 100);
        }
    }, [startTime, endTime]);

    useEffect(() => {
        if (isOpen && task.myTimesheet) {
            const t = task.myTimesheet;
            const dateStr = t.date ? new Date(t.date).toISOString().split('T')[0] : '';
            if (dateStr) setDate(dateStr);
            if (t.startTime) setStartTime(t.startTime);
            if (t.endTime) setEndTime(t.endTime);
            if (t.description) setDescription(t.description);
            if (t.result) setResult(t.result);
        } else if (isOpen && !task.myTimesheet) {
            // Reset to defaults when opening for a new task
            setDate(new Date().toISOString().split('T')[0]);
            setStartTime('08:00');
            setEndTime('17:00');
            setDescription('');
            setResult('');
        }
    }, [isOpen, task.myTimesheet]);

    const isApproved = task.myTimesheet?.status === 'Approved';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (hours <= 0) {
            setError('Thời gian kết thúc phải lớn hơn thời gian bắt đầu');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            const payload = {
                taskId: task.id,
                workspaceId,
                date,
                startTime,
                endTime,
                hours,
                description,
                result
            };

            if (task.myTimesheet) {
                await updateTimesheet(task.myTimesheet._id, payload);
            } else {
                await createTimesheet(payload);
            }
            
            onSuccess();
            
            // Reset form
            setDescription('');
            setResult('');
            
            onClose();
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra khi log time');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                className="bg-[#0f1f1b] border border-teal-800/50 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-5 border-b border-teal-800/50">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            {task.myTimesheet ? <Edit3 className="text-teal-500" /> : <Clock className="text-teal-500" />}
                            {task.myTimesheet ? 'Cập nhật Timesheet' : 'Log Time'}
                        </h3>
                        <p className="text-teal-200/60 text-sm mt-1 truncate max-w-[300px]">
                            {task.title}
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-teal-200/50 hover:text-white p-2 hover:bg-teal-900/30 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-transparent">
                    {isApproved && (
                        <div className="bg-green-500/10 text-green-400 p-3 rounded-xl mb-5 text-sm border border-green-500/20 font-bold flex items-center gap-2">
                            <CheckCircle size={16} />
                            Bản ghi này đã được duyệt, không thể chỉnh sửa.
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-500/10 text-red-500 p-3 rounded-xl mb-5 text-sm border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <form id="logTimeForm" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-teal-200/60 text-xs mb-1 block">Ngày làm việc <span className="text-red-400">*</span></label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                disabled={isApproved}
                                className="w-full p-2.5 bg-black/20 text-white border border-teal-800 rounded-xl focus:outline-none focus:border-teal-500 text-sm transition-colors disabled:opacity-50"
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-teal-200/60 text-xs mb-1 block">Bắt đầu <span className="text-red-400">*</span></label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    disabled={isApproved}
                                    className="w-full p-2.5 bg-black/20 text-white border border-teal-800 rounded-xl focus:outline-none focus:border-teal-500 text-sm transition-colors disabled:opacity-50"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-teal-200/60 text-xs mb-1 block">Kết thúc <span className="text-red-400">*</span></label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    disabled={isApproved}
                                    className="w-full p-2.5 bg-black/20 text-white border border-teal-800 rounded-xl focus:outline-none focus:border-teal-500 text-sm transition-colors disabled:opacity-50"
                                    required
                                />
                            </div>
                            <div className="w-24">
                                <label className="text-teal-200/60 text-xs mb-1 block">Tổng (Giờ)</label>
                                <div className="w-full p-2.5 bg-teal-900/30 text-teal-400 font-bold border border-teal-800/50 rounded-xl text-center text-sm">
                                    {hours}h
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-teal-200/60 text-xs mb-1 flex items-center gap-1">
                                <FileText size={12} />
                                Chi tiết công việc đã làm <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isApproved}
                                placeholder="Mô tả ngắn gọn bạn đã làm gì..."
                                rows={3}
                                className="w-full p-3 bg-black/20 text-white border border-teal-800 rounded-xl focus:outline-none focus:border-teal-500 text-sm transition-colors placeholder:text-teal-200/30 resize-none disabled:opacity-50"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-teal-200/60 text-xs mb-1 flex items-center gap-1">
                                <CheckCircle size={12} />
                                Kết quả (Tùy chọn)
                            </label>
                            <input
                                type="text"
                                value={result}
                                onChange={(e) => setResult(e.target.value)}
                                disabled={isApproved}
                                placeholder="Link tài liệu, commit, hoặc kết quả đạt được..."
                                className="w-full p-3 bg-black/20 text-white border border-teal-800 rounded-xl focus:outline-none focus:border-teal-500 text-sm transition-colors placeholder:text-teal-200/30 disabled:opacity-50"
                            />
                        </div>
                    </form>
                </div>
                
                <div className="p-5 border-t border-teal-800/50 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl text-teal-200/60 font-bold hover:bg-teal-900/40 hover:text-white transition-colors text-sm"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        form="logTimeForm"
                        disabled={loading || hours <= 0 || isApproved}
                        className="flex-1 py-2.5 rounded-xl bg-teal-500 text-[#0f1f1b] font-bold hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-[#0f1f1b] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Clock size={16} />
                        )}
                        {task.myTimesheet ? 'Lưu Thay Đổi' : 'Xác Nhận'}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};
