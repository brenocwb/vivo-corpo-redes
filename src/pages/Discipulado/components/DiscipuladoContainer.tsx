
import { useDiscipuladoData } from '../hooks/useDiscipuladoData';
import { useDiscipuladoDialogs } from '../hooks/useDiscipuladoDialogs';
import { DiscipuladoView } from './DiscipuladoView';
import { useAuth } from '@/context/AuthContext';

export function DiscipuladoContainer() {
  const { discipulados, loading, fetchDiscipulados } = useDiscipuladoData();
  const dialogsState = useDiscipuladoDialogs();
  const { isAdmin, isDiscipulador } = useAuth();
  
  const isLeaderOrAdmin = isAdmin() || isDiscipulador();
  
  return (
    <DiscipuladoView 
      discipulados={discipulados} 
      loading={loading}
      fetchDiscipulados={fetchDiscipulados}
      dialogsState={dialogsState}
      isLeaderOrAdmin={isLeaderOrAdmin}
    />
  );
}
