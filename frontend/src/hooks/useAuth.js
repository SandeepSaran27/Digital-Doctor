import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice';

const useAuth = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated, loading, error } = useSelector((s) => s.auth);

    const handleLogout = () => dispatch(logoutUser());
    const hasRole = (...roles) => roles.includes(user?.role);

    return { user, isAuthenticated, loading, error, logout: handleLogout, hasRole, role: user?.role };
};

export default useAuth;
