export interface UserInterface {
    _id: string;
    name: string;
    email: string;
}

export interface WorkspaceInterface {
    _id: string;
    name: string;
    leader: UserInterface;
    members: UserInterface[];
    createdAt: string;
    updatedAt: string;
}
