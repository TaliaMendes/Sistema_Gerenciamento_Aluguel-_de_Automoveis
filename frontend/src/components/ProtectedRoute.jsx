import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children, requireAdmin = false }) {
  const {  isAuthenticated, adminCredentials } = useAuth();

  if (requireAdmin) {
    if (!adminCredentials.username) {
      return <Navigate to="/admin" replace />;
    }
    return children;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
