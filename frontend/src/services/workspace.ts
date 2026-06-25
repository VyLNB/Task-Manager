import { apiRequest } from "./client";
import type { WorkspaceInterface } from "../interfaces/workspace";

export async function createWorkspace(
    name: string,
    startDate?: string,
    endDate?: string,
    status?: string
): Promise<WorkspaceInterface> {
    return apiRequest<WorkspaceInterface>("post", "/workspaces/", { name, startDate, endDate, status });
}

export async function getWorkspaces(): Promise<{ message: string, data: WorkspaceInterface[] }> {
    return apiRequest<{ message: string, data: WorkspaceInterface[] }>("get", "/workspaces/");
}

export async function inviteMember(
    workspaceId: string,
    email: string
) {
    return apiRequest("post", `/workspaces/${workspaceId}/invite`, { email });
}

export async function getAllProjectsAdmin(): Promise<{ message: string, data: WorkspaceInterface[] }> {
    return apiRequest<{ message: string, data: WorkspaceInterface[] }>("get", "/workspaces/all");
}

export async function updateWorkspaceStatus(workspaceId: string, status: string): Promise<{ message: string, data: WorkspaceInterface }> {
    return apiRequest<{ message: string, data: WorkspaceInterface }>("put", `/workspaces/${workspaceId}/status`, { status });
}