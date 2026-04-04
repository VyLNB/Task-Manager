export interface ToDoItemInterface{
    _id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ToDoItemFormData {
    title: string;
    description: string;
    status: 'TO DO' | 'IN PROGRESS' | 'COMPLETED';
}