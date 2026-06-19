import { useMemo } from 'react';

export const usePermission = () => {
    // Lấy thông tin user từ localStorage
    const userString = localStorage.getItem('user');
    const userObj = userString ? JSON.parse(userString) : null;
    const role = userObj?.user?.role; 

    const hasPermission = useMemo(() => {
        return (permissionCode: string) => {
            if (!role) return false;
            if (role.name === 'Admin') return true; // Admin có mọi quyền
            return role.permissions?.includes(permissionCode) || false;
        };
    }, [role]);

    const isAdmin = useMemo(() => {
        return role?.name === 'Admin';
    }, [role]);

    const isMember = useMemo(() => {
        return role?.name === 'Member' || role?.name === 'Project Manager';
    }, [role]);

    const isProjectManager = useMemo(() => {
        return role?.name === 'Project Manager';
    }, [role]);

    return { hasPermission, isAdmin, isMember, isProjectManager, role };
};
