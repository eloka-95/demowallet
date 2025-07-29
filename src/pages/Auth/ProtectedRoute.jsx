// import { useAuth } from '../../context/AuthContext';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';

// const ProtectedRoute = ({ isAdmin = false }) => {
//     const { currentUser, userRole, userStatus, isBlocked, loading } = useAuth();
//     const location = useLocation();

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     // Check if account is active
//     if (currentUser && (userStatus !== 'active' || isBlocked)) {
//         return <Navigate to="/login" state={{
//             from: location,
//             error: "Your account is not active or deactivated. Please contact support."
//         }} replace />;
//     }

//     // Check admin routes
//     if (isAdmin && userRole !== 'admin') {
//         return <Navigate to="/" replace />;
//     }

//     return currentUser ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
// };

// export default ProtectedRoute;




import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ isAdmin = false }) => {
    const { currentUser, userRole, userStatus, isBlocked, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    // Check if token is expired (if you implement expiration)
    const tokenExpired = localStorage.getItem('authTokenExpiry')
        && Date.now() > parseInt(localStorage.getItem('authTokenExpiry'));

    if (tokenExpired) {
        return <Navigate to="/wallet/login" state={{
            from: location,
            error: "Your session has expired. Please login again."
        }} replace />;
    }

    // Check if account is active
    if (currentUser && (userStatus !== 'active' || isBlocked)) {
        return <Navigate to="/wallet/login" state={{
            from: location,
            error: "Your account is not active or deactivated. Please contact support."
        }} replace />;
    }

    // Check admin routes
    if (isAdmin && userRole !== 'admin') {
        return <Navigate to="/wallet" replace />;
    }

    return currentUser ? <Outlet /> : <Navigate to="/wallet/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;