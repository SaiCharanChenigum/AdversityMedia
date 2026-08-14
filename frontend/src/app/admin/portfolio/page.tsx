import PortfolioAdminClient from './PortfolioAdminClient';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AdminPortfolioPage() {
  return (
    <ProtectedRoute>
      <PortfolioAdminClient />
    </ProtectedRoute>
  );
}
