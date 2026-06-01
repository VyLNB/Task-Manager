export type Priority = 'HIGH PRIORITY' | 'MEDIUM PRIORITY' | 'LOW PRIORITY';
export type Status = 'TO DO' | 'IN PROGRESS' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  date: string;
  tags: string[];
  progress?: number;
  completedSubtasks?: number;
  totalSubtasks?: number;
}
