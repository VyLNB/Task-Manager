export type Priority = 'HIGH PRIORITY' | 'MEDIUM PRIORITY' | 'LOW PRIORITY' | 'HIGH' | 'MEDIUM' | 'LOW';
export type Status = 'TO DO' | 'IN PROGRESS' | 'COMPLETED';
export type TaskType = 'Planned' | 'Sub-task' | 'Bug Fixing' | 'Ad-hoc';

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
  assignee?: {
    fullName: string;
    email: string;
  };
  assigneeId?: string;
  creatorId?: string;
  workspaceId?: string;
  sprintId?: string;
  estimatedHours?: number;
  taskType?: TaskType;
  isPaused?: boolean;
  isCancelled?: boolean;
  startDate?: string;
  dueDate?: string;
  description?: string;
  myTimesheet?: any;
  hasAnyTimesheet?: boolean;
}
