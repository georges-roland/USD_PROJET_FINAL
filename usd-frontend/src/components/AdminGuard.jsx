import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminGuard({ children }) {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to="/admin" />;
  return children;
}
