import PortfolioAdminClient from './PortfolioAdminClient';
import ProtectedRoute from '../components/ProtectedRoute';

export const dynamic = 'force-dynamic';

export default function AdminPortfolioPage() {
  return (
    <ProtectedRoute>
      <PortfolioAdminClient />
    </ProtectedRoute>
  );
}
