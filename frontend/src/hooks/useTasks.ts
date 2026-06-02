import { useState, useEffect, useCallback } from 'react';
import { getAllToDo, getWorkspaceTasks, updateTask } from '../services/todo';
import type { Task, Status } from '../interfaces/task';

export function useTasks(workspaceId?: string) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const data = workspaceId ? await getWorkspaceTasks(workspaceId) : await getAllToDo();

            const convertedTasks: Task[] = data.map((item: any) => { 
                const dateObj = new Date(item.createdAt);
                const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                let currentStatus = item.status;
                if (!currentStatus) {
                   currentStatus = item.completed ? 'COMPLETED' : 'TO DO';
                }

                let tagName = 'CÁ NHÂN';
                if (item.workspaceId) {
                    if (typeof item.workspaceId === 'object' && item.workspaceId.name) {
                        tagName = item.workspaceId.name.toUpperCase();
                    } else {
                        tagName = 'WORKSPACE';
                    }
                }

                return {
                    id: item._id,
                    title: item.title,
                    status: currentStatus, 
                    priority: 'MEDIUM PRIORITY', 
                    date: formattedDate,
                    tags: [tagName], 
                    completedSubtasks: currentStatus === 'COMPLETED' ? 1 : 0,
                    totalSubtasks: 1,
                };
            });
            setTasks(convertedTasks);
            setError(null);
        } catch (error) {
            setError('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    }, [workspaceId]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleUpdateTaskStatus = async (newStatus: Status, taskId: string) => {
        if (!taskId) return;
        const previousTasks = [...tasks];

        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        );

        try {
            await updateTask(taskId, { status: newStatus } as any); 
        } catch (error) {
            console.error('Failed to update task status:', error);
            setError('Failed to update task status. Please try again.');
            setTasks(previousTasks);
            alert("Không thể cập nhật trạng thái, vui lòng thử lại!");
        }
    };

    return { tasks, loading, error, fetchTasks, handleUpdateTaskStatus };
}
