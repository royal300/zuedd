import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { ReactNode } from 'react';

const AdminRoute = ({ children }: { children: ReactNode }) => {
    const { isAdmin } = useAdminAuth();
    if (!isAdmin) return <Navigate to="/admin/login" replace />;
    return <>{children}</>;
};

export default AdminRoute;
