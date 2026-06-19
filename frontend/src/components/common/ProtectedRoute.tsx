import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePermission } from '../../hooks/usePermission';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
    requireMember?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin, requireMember }) => {
    const { isAdmin, isMember } = usePermission();
    const location = useLocation();

    const userString = localStorage.getItem('user');
    if (!userString) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/todoapp/dashboard" replace />;
    }

    if (requireMember && isAdmin) {
        return <Navigate to="/todoapp/personnel" replace />;
    }

    if (requireMember && !isMember && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
