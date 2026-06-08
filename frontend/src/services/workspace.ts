import { apiRequest } from "./client";
import type { WorkspaceInterface } from "../interfaces/workspace";

export async function createWorkspace(name: string): Promise<WorkspaceInterface> {
    return apiRequest<WorkspaceInterface>("post", "/workspaces/", { name });
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