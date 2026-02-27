import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import Layout from './Layout';

/**
 * Wraps a route requiring authentication and optional role restriction.
 * Props:
 *   - roles: string[] — allowed roles. If empty/undefined, any authenticated user is permitted.
 *   - noLayout: bool — skip the Layout shell (e.g. for fullscreen pages)
 */
const ProtectedRoute = ({ children, roles = [], noLayout = false }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-slate-400 text-sm">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles.length > 0 && !roles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    if (noLayout) return children;

    return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
