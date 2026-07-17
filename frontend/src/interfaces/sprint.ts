export interface Sprint {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  workspaceId: string;
  status: 'Planned' | 'Active' | 'Completed';
}
