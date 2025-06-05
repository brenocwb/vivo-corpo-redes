
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, MessageSquare, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PedidoOracao, Testemunho } from '@/types';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function Comunidade() {
  const { user } = useAuth();
  const [pedidosOracao, setPedidosOracao] = useState<PedidoOracao[]>([]);
  const [testemunhos, setTestemunhos] = useState<Testemunho[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoPedido, setNovoPedido] = useState('');
  const [novoTestemunho, setNovoTestemunho] = useState('');

  const fetchCommunityData = async () => {
    setLoading(true);
    try {
      // Buscar pedidos de oração
      const { data: pedidos, error: errorPedidos } = await supabase
        .from('pedidos_oracao')
        .select(`
          *,
          usuario:users(nome)
        `)
        .order('criado_em', { ascending: false });

      if (errorPedidos) throw errorPedidos;

      // Buscar testemunhos
      const { data: testemunhosData, error: errorTestemunhos } = await supabase
        .from('testemunhos')
        .select(`
          *,
          usuario:users(nome)
        `)
        .order('criado_em', { ascending: false });

      if (errorTestemunhos) throw errorTestemunhos;

      setPedidosOracao(pedidos || []);
      setTestemunhos(testemunhosData || []);
    } catch (error: any) {
      console.error('Erro ao buscar dados da comunidade:', error);
      toast.error('Erro ao carregar dados da comunidade');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPedido = async () => {
    if (!novoPedido.trim()) return;

    try {
      const { error } = await supabase
        .from('pedidos_oracao')
        .insert({
          pedido: novoPedido,
          user_id: user?.id
        });

      if (error) throw error;

      setNovoPedido('');
      toast.success('Pedido de oração enviado!');
      fetchCommunityData();
    } catch (error: any) {
      console.error('Erro ao enviar pedido:', error);
      toast.error('Erro ao enviar pedido de oração');
    }
  };

  const handleSubmitTestemunho = async () => {
    if (!novoTestemunho.trim()) return;

    try {
      const { error } = await supabase
        .from('testemunhos')
        .insert({
          texto: novoTestemunho,
          user_id: user?.id
        });

      if (error) throw error;

      setNovoTestemunho('');
      toast.success('Testemunho compartilhado!');
      fetchCommunityData();
    } catch (error: any) {
      console.error('Erro ao enviar testemunho:', error);
      toast.error('Erro ao compartilhar testemunho');
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Comunidade</h1>
            <p className="text-muted-foreground">
              Compartilhe pedidos de oração e testemunhos com a comunidade.
            </p>
          </div>
          <Button onClick={fetchCommunityData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
          </Button>
        </div>

        <Tabs defaultValue="pedidos" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pedidos">Pedidos de Oração</TabsTrigger>
            <TabsTrigger value="testemunhos">Testemunhos</TabsTrigger>
          </TabsList>

          <TabsContent value="pedidos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compartilhar Pedido de Oração</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Compartilhe seu pedido de oração..."
                  value={novoPedido}
                  onChange={(e) => setNovoPedido(e.target.value)}
                />
                <Button onClick={handleSubmitPedido}>
                  <Plus className="w-4 h-4 mr-2" /> Compartilhar Pedido
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {pedidosOracao.map((pedido) => (
                <Card key={pedido.id}>
                  <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      {pedido.usuario?.nome || 'Anônimo'} • {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{pedido.conteudo}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="testemunhos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compartilhar Testemunho</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Compartilhe seu testemunho..."
                  value={novoTestemunho}
                  onChange={(e) => setNovoTestemunho(e.target.value)}
                />
                <Button onClick={handleSubmitTestemunho}>
                  <Heart className="w-4 h-4 mr-2" /> Compartilhar Testemunho
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {testemunhos.map((testemunho) => (
                <Card key={testemunho.id}>
                  <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      {testemunho.usuario?.nome || 'Anônimo'} • {new Date(testemunho.created_at).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{testemunho.conteudo}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
