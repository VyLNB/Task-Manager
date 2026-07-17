export interface ToDoItemInterface{
    _id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    editHistory?: {
        updatedBy: { _id: string; fullName: string; email: string } | string;
        fieldsChanged: string[];
        timestamp: Date;
        note?: string;
    }[];
}

export interface ToDoItemFormData {
    title: string;
    description: string;
    status: 'TO DO' | 'IN PROGRESS' | 'COMPLETED';
    workspaceId?: string;
    assigneeId?: string;
    priority?: string;
    sprintId?: string;
    estimatedHours?: number;
    taskType?: string;
    isPaused?: boolean;
    isCancelled?: boolean;
    startDate?: Date | string | null;
    dueDate?: Date | string | null;
}