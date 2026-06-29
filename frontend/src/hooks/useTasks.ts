import { useState, useEffect, useCallback } from 'react';
import { getAllToDo, getWorkspaceTasks, updateTask } from '../services/task';
import { getMyTimesheets, getWorkspaceTimesheets } from '../services/timesheet';
import type { Task, Status, Priority } from '../interfaces/task';

export function useTasks(workspaceId?: string) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const userString = localStorage.getItem('user');
            const userObj = userString ? JSON.parse(userString) : null;
            const isPM = userObj?.user?.role?.name === 'Project Manager';

            const [data, timesheetRes, workspaceTimesheetRes] = await Promise.all([
                workspaceId ? getWorkspaceTasks(workspaceId) : getAllToDo(),
                workspaceId ? getMyTimesheets({ workspaceId }) : getMyTimesheets(),
                (workspaceId && isPM) ? getWorkspaceTimesheets(workspaceId) : Promise.resolve({ data: [] })
            ]);

            const timesheets = timesheetRes.data || [];
            const allWorkspaceTimesheets = workspaceTimesheetRes.data || [];

            const convertedTasks: Task[] = data.map((item: any) => {
                const dateObj = new Date(item.createdAt);
                const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                let currentStatus = item.status;
                if (!currentStatus) {
                    currentStatus = item.completed ? 'COMPLETED' : 'TO DO';
                }

                let tagName = 'WORKSPACE';
                if (item.workspaceId && typeof item.workspaceId === 'object' && item.workspaceId.name) {
                    tagName = item.workspaceId.name.toUpperCase();
                }
                
                const myTimesheet = timesheets.find((t: any) =>
                    (typeof t.taskId === 'object' ? t.taskId._id : t.taskId) === item._id
                );

                const hasAnyTimesheet = allWorkspaceTimesheets.some((t: any) => 
                    (typeof t.taskId === 'object' ? t.taskId._id : t.taskId) === item._id
                );

                return {
                    id: item._id,
                    title: item.title,
                    status: currentStatus,
                    priority: (item.priority ? `${item.priority} PRIORITY` : 'MEDIUM PRIORITY') as Priority,
                    date: formattedDate,
                    tags: [tagName],
                    completedSubtasks: currentStatus === 'COMPLETED' ? 1 : 0,
                    totalSubtasks: 1,
                    assignee: item.assigneeId ? {
                        fullName: item.assigneeId.fullName,
                        email: item.assigneeId.email
                    } : undefined,
                    assigneeId: item.assigneeId ? item.assigneeId._id : undefined,
                    creatorId: item.creatorId,
                    workspaceId: typeof item.workspaceId === 'object' ? item.workspaceId?._id : item.workspaceId,
                    myTimesheet,
                    hasAnyTimesheet: hasAnyTimesheet || !!myTimesheet,
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
        const handleTaskUpdate = () => fetchTasks();
        window.addEventListener('task_created', handleTaskUpdate);
        window.addEventListener('task_updated', handleTaskUpdate);
        return () => {
            window.removeEventListener('task_created', handleTaskUpdate);
            window.removeEventListener('task_updated', handleTaskUpdate);
        };
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
        } catch (error: any) {
            console.error('Failed to update task status:', error);
            setError('Failed to update task status. Please try again.');
            setTasks(previousTasks);
            const msg = error.response?.data?.message || "Không thể cập nhật trạng thái, vui lòng thử lại!";
            alert(msg);
        }
    };

    return { tasks, loading, error, fetchTasks, handleUpdateTaskStatus };
}
