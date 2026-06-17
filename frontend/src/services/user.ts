import { apiRequest } from "./client";
import type { UserInterface } from "../interfaces/user";

export async function getAllUsers(): Promise<UserInterface[]> {
    return apiRequest<UserInterface[]>("get", "/users");
}
