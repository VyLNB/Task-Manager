import React from 'react';
import { KanbanColumn } from './KanbanColumn';
import type { Task, Status } from '../../interfaces/task';

interface KanbanBoardProps {
    tasks: Task[];
    loading?: boolean;
    error?: string | null;
    onUpdateTaskStatus: (newStatus: Status, taskId: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, loading, error, onUpdateTaskStatus }) => {
    
    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData('text/plain', id);
    };

    return (
        <>
            {loading && <p className="text-[#2DD480] mb-4">Loading tasks...</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KanbanColumn
                    status="TO DO"
                    title="CẦN LÀM"
                    tasks={tasks.filter((t) => t.status === 'TO DO')}
                    onDragStart={handleDragStart}
                    onDrop={onUpdateTaskStatus} 
                />
                <KanbanColumn
                    status="IN PROGRESS"
                    title="ĐANG LÀM"
                    tasks={tasks.filter((t) => t.status === 'IN PROGRESS')}
                    onDragStart={handleDragStart}
                    onDrop={onUpdateTaskStatus}
                />
                <KanbanColumn
                    status="COMPLETED"
                    title="HOÀN THÀNH"
                    tasks={tasks.filter((t) => t.status === 'COMPLETED')}
                    onDragStart={handleDragStart}
                    onDrop={onUpdateTaskStatus}
                />
            </div>
        </>
    );
};
