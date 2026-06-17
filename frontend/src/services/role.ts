import { apiRequest } from "./client";
import type { RoleInterface } from "../interfaces/role";

export async function getAllRoles(): Promise<RoleInterface[]> {
    return apiRequest<RoleInterface[]>("get", "/roles");
}

export async function assignRole(userId: string, roleId: string): Promise<any> {
    return apiRequest<any>("post", "/roles/assign", { userId, roleId });
}

export async function createRole(name: string, permissions: string[]): Promise<RoleInterface> {
    return apiRequest<RoleInterface>("post", "/roles", { name, permissions });
}

export async function updateRole(id: string, name: string, permissions: string[]): Promise<RoleInterface> {
    return apiRequest<RoleInterface>("put", `/roles/${id}`, { name, permissions });
}
