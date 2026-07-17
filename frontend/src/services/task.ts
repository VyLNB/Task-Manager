import { apiRequest } from "./client";

import type { ToDoItemInterface, ToDoItemFormData } from "../interfaces/todo";

export async function getAllToDo(assignee?: string): Promise<ToDoItemInterface[]> {
    const url = assignee ? `/tasks/?assignee=${assignee}` : `/tasks/`;
    return apiRequest<ToDoItemInterface[]>("get", url);
}

export async function deleteTask(id: string): Promise<any> {
    return apiRequest("delete", `/tasks/${id}`);
}

export async function approveTaskChangeRequest(requestId: string): Promise<any> {
    return apiRequest("put", `/task-change-requests/${requestId}/approve`);
}

export async function rejectTaskChangeRequest(requestId: string): Promise<any> {
    return apiRequest("put", `/task-change-requests/${requestId}/reject`);
}

export async function getToDoById(id: string): Promise<ToDoItemInterface> {
    return apiRequest<ToDoItemInterface>("get", `/tasks/${id}`);
}

export async function getWorkspaceTasks(workspaceId: string): Promise<ToDoItemInterface[]> {
    return apiRequest<ToDoItemInterface[]>("get", `/tasks/workspace/${workspaceId}`);
}

export async function updateTask(id: string, data: ToDoItemFormData): Promise<ToDoItemInterface> {
    return apiRequest<ToDoItemInterface>("put", `/tasks/${id}`, data); 
}

export async function createTask(data: ToDoItemFormData): Promise<ToDoItemInterface> {
    return apiRequest<ToDoItemInterface>("post", `/tasks/`, data);
}

export async function pauseTask(id: string): Promise<ToDoItemInterface> {
    return apiRequest<ToDoItemInterface>("put", `/tasks/${id}/pause`);
}

export async function cancelTask(id: string): Promise<ToDoItemInterface> {
    return apiRequest<ToDoItemInterface>("put", `/tasks/${id}/cancel`);
}