
import { useAuth } from '@/context/AuthContext';
import AdminDashboard from './AdminDashboard';
import LiderDashboard from './LiderDashboard';
import MembroDashboard from './MembroDashboard';
import { Layout } from '@/components/layout/Layout';

export default function Dashboard() {
  const { isAdmin, isLider } = useAuth();
  
  return (
    <Layout>
      {isAdmin() ? (
        <AdminDashboard />
      ) : isLider() ? (
        <LiderDashboard />
      ) : (
        <MembroDashboard />
      )}
    </Layout>
  );
}
