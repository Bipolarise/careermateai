import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Responsibility;  The file only handle to redirecting to login page if the user is not logged in or if the token is expired
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
