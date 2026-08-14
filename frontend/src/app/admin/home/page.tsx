import HomeAdminClient from './HomeAdminClient';
import ProtectedRoute from '../components/ProtectedRoute';

export const dynamic = 'force-dynamic';

export default function AdminHomePage() {
  return (
    <ProtectedRoute>
      <HomeAdminClient />
    </ProtectedRoute>
  );
}
