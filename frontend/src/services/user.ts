import { apiRequest } from "./client";
import type { UserInterface } from "../interfaces/user";

export async function getAllUsers(): Promise<UserInterface[]> {
    return apiRequest<UserInterface[]>("get", "/users");
}

export async function toggleUserStatus(userId: string): Promise<any> {
    return apiRequest<any>("put", `/users/${userId}/status`);
}
