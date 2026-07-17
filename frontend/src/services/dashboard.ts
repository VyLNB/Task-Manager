import { apiRequest } from "./client";

export interface DashboardStats {
    users: {
        total: number;
        newThisMonth: number;
    };
    workspaces: {
        total: number;
        unfinished: number;
    };
    tasksRaw: {
        _id: {
            status: string;
            workspaceId: string;
        };
        count: number;
    }[];
    allWorkspaces: {
        _id: string;
        name: string;
    }[];
    workspacesByStatus: {
        name: string;
        value: number;
    }[];
    nearDeadlineWorkspaces: {
        _id: string;
        name: string;
        endDate: string;
        status: string;
        leader: {
            _id: string;
            fullName: string;
            email: string;
        };
    }[];
    workingTimeByWorkspace: {
        workspaceName: string;
        hours: number;
    }[];
}

export async function getAdminDashboardStats(): Promise<DashboardStats> {
    return apiRequest<DashboardStats>("get", "/dashboard/admin");
}

export interface PMDashboardStats {
    totalProjects: number;
    pendingTimesheets: number;
    nearDeadlineProjects: {
        _id: string;
        name: string;
        endDate: string;
        status: string;
        leader: {
            _id: string;
            fullName: string;
            email: string;
        };
    }[];
    tasksRaw: {
        _id: {
            status: string;
            workspaceId: string;
        };
        count: number;
    }[];
    allWorkspaces: {
        _id: string;
        name: string;
    }[];
    workingTimeByWorkspace: {
        workspaceName: string;
        hours: number;
    }[];
    pendingChangeRequests?: {
        _id: string;
        taskId: { _id: string; title: string };
        workspaceId: { _id: string; name: string };
        requestedBy: { _id: string; fullName: string; email: string };
        changes: {
            estimatedHours?: { old: number; new: number };
            startDate?: { old: string; new: string };
            dueDate?: { old: string; new: string };
        };
        status: string;
        createdAt: string;
    }[];
}

export async function getPMDashboardStats(): Promise<PMDashboardStats> {
    return apiRequest<PMDashboardStats>("get", "/dashboard/pm");
}
