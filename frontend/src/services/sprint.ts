import { apiRequest } from "./client";
import type { Sprint } from '../interfaces/sprint.ts';

export const createSprint = async (sprintData: Partial<Sprint>): Promise<any> => {
  return apiRequest<any>("post", `/sprints`, sprintData);
};

export const getSprintsByWorkspace = async (workspaceId: string): Promise<any> => {
  return apiRequest<any>("get", `/sprints/workspace/${workspaceId}`);
};

export const updateSprint = async (id: string, sprintData: Partial<Sprint>): Promise<any> => {
  return apiRequest<any>("put", `/sprints/${id}`, sprintData);
};

export const deleteSprint = async (id: string): Promise<any> => {
  return apiRequest<any>("delete", `/sprints/${id}`);
};
