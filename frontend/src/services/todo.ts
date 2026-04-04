// api/todo.ts
import { apiRequest } from "./client";
import type { ToDoItemInterface, ToDoItemFormData } from "../interfaces/todo";

export async function getAllToDo(): Promise<ToDoItemInterface[]> {
    return apiRequest<ToDoItemInterface[]>("get", `/getAll`);
}

export async function getToDoById(id: string): Promise<ToDoItemInterface> {
    return apiRequest<ToDoItemInterface>("get", `/${id}`);
}

// Cập nhật hàm updateTask: 
// 1. Nhận vào id
// 2. Nhận vào data chuẩn (ToDoItemFormData)
export async function updateTask(id: string, data: ToDoItemFormData): Promise<ToDoItemInterface> {
    // Lưu ý: Return type thường là object đã update, không phải array. 
    // Nếu backend của bạn trả về array, hãy đổi lại thành Promise<ToDoItemInterface[]>
    return apiRequest<ToDoItemInterface>("put", `/${id}`, data); 
}

export async function createTask(data: ToDoItemFormData): Promise<ToDoItemInterface> {
    // API tạo mới thường trả về object vừa tạo
    return apiRequest<ToDoItemInterface>("post", `/createNew`, data);
}