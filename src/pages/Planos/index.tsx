
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, BookOpen, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Plano } from '@/types';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Planos() {
  const { user, isAdmin } = useAuth();
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlanos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('planos')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedPlanos = data.map(plano => ({
          id: plano.id,
          titulo: plano.nome,
          descricao: plano.descricao,
          etapas: plano.etapas ? JSON.parse(JSON.stringify(plano.etapas)) : [],
          created_at: plano.criado_em
        }));
        setPlanos(formattedPlanos);
      }
    } catch (error: any) {
      console.error('Erro ao buscar planos:', error);
      toast.error('Erro ao carregar planos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanos();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Planos de Discipulado</h1>
            <p className="text-muted-foreground">
              Gerencie os planos de estudo e crescimento espiritual.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchPlanos} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
            </Button>
            {isAdmin() && (
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" /> Novo Plano
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : planos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Nenhum plano encontrado</h3>
              <p className="text-muted-foreground">
                {isAdmin() ? 'Comece criando o primeiro plano de discipulado.' : 'Não há planos disponíveis no momento.'}
              </p>
              {isAdmin() && (
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" /> Criar Primeiro Plano
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {planos.map((plano) => (
              <Card key={plano.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {plano.titulo}
                  </CardTitle>
                  <CardDescription>
                    {plano.descricao || 'Sem descrição'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      {plano.etapas.length} etapas
                    </Badge>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
