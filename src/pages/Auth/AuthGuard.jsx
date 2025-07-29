import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const AuthGuard = ({ children }) => {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (currentUser) {
        // Redirect to appropriate dashboard based on role
        return <Navigate to={userRole === 'admin' ? '/wallet/admin' : '/wallet'} replace />;
    }

    return children;
};

export default AuthGuard;