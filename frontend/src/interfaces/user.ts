export interface UserInterface {
    _id: string;
    fullName: string;
    email: string;
    roleId?: {
        _id: string;
        name: string;
        permissions: string[];
    };
    createdAt: string;
    updatedAt: string;
}
