import type { Task } from './task';

export interface TimesheetInterface {
    _id: string;
    taskId: string | Task | any;
    userId: string | any;
    workspaceId: string | any;
    date: string;
    startTime: string;
    endTime: string;
    hours: number;
    description: string;
    result?: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    pmComment?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTimesheetDTO {
    taskId: string;
    workspaceId: string;
    date: string;
    startTime: string;
    endTime: string;
    hours: number;
    description: string;
    result?: string;
}
