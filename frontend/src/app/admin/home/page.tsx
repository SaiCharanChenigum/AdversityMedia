import HomeAdminClient from './HomeAdminClient';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AdminHomePage() {
  return (
    <ProtectedRoute>
      <HomeAdminClient />
    </ProtectedRoute>
  );
}
