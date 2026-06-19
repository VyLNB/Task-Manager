export interface UserInterface {
    _id: string;
    fullName: string;
    email: string;
}

export interface WorkspaceInterface {
    _id: string;
    name: string;
    startDate?: string;
    endDate?: string;
    status: 'Kế hoạch' | 'Đang thực hiện' | 'Đã hoàn thành' | 'Tạm dừng';
    leader: UserInterface;
    members: UserInterface[];
    createdAt: string;
    updatedAt: string;
}
