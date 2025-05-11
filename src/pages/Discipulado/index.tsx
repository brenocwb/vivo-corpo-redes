
import { Layout } from '@/components/layout/Layout';
import { useDiscipuladoData } from './hooks/useDiscipuladoData';
import { useDiscipuladoDialogs } from './hooks/useDiscipuladoDialogs';
import { DiscipuladoView } from './components/DiscipuladoView';

export default function Discipulado() {
  const { discipulados, loading, fetchDiscipulados } = useDiscipuladoData();
  const dialogsState = useDiscipuladoDialogs();
  
  return (
    <Layout>
      <DiscipuladoView 
        discipulados={discipulados} 
        loading={loading}
        fetchDiscipulados={fetchDiscipulados}
        dialogsState={dialogsState}
      />
    </Layout>
  );
}
