import { apiRequest } from "./client";
import type { WorkspaceInterface } from "../interfaces/workspace";

export async function createWorkspace(name: string): Promise<WorkspaceInterface> {
    return apiRequest<WorkspaceInterface>("post", "/workspaces/", { name });
}

export async function getWorkspaces(): Promise<{ message: string, data: WorkspaceInterface[] }> {
    return apiRequest<{ message: string, data: WorkspaceInterface[] }>("get", "/workspaces/");
}
