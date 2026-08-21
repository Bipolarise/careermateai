import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Responsibility: redirect to /onboarding if the logged-in user hasn't completed onboarding yet
export default function RequireOnboarding() {
  const { hasCompletedOnboarding } = useAuth();

  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
