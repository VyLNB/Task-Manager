import { apiRequest } from "./client";
import type { TimesheetInterface, CreateTimesheetDTO } from "../interfaces/timesheet";

export async function createTimesheet(data: CreateTimesheetDTO): Promise<{ message: string, data: TimesheetInterface }> {
    return apiRequest("post", "/timesheets/", data);
}

export async function getMyTimesheets(params?: { workspaceId?: string, startDate?: string, endDate?: string }): Promise<{ message: string, data: TimesheetInterface[] }> {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest("get", `/timesheets/me?${query}`);
}

export async function updateTimesheet(id: string, data: Partial<CreateTimesheetDTO>): Promise<{ message: string, data: TimesheetInterface }> {
    return apiRequest("put", `/timesheets/${id}`, data);
}

export async function deleteTimesheet(id: string): Promise<{ message: string }> {
    return apiRequest("delete", `/timesheets/${id}`);
}

export async function getWorkspaceTimesheets(workspaceId: string, params?: { status?: string, memberId?: string, startDate?: string, endDate?: string }): Promise<{ message: string, data: TimesheetInterface[] }> {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest("get", `/timesheets/workspace/${workspaceId}?${query}`);
}

export async function updateTimesheetStatus(id: string, status: 'Approved' | 'Rejected', pmComment?: string): Promise<{ message: string, data: TimesheetInterface }> {
    return apiRequest("patch", `/timesheets/${id}/status`, { status, pmComment });
}

export async function getAllTimesheets(): Promise<{ message: string, data: TimesheetInterface[] }> {
    return apiRequest("get", `/timesheets/all`);
}
