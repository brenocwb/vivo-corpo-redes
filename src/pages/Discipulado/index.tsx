
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Users, Calendar, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Discipulado as DiscipuladoType } from '@/types';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Discipulado() {
  const { user, isAdmin, isDiscipulador } = useAuth();
  const [discipulados, setDiscipulados] = useState<DiscipuladoType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDiscipulados = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('discipulados')
        .select(`
          *,
          discipulador:users!discipulados_discipulador_id_fkey(id, nome, email),
          discipulo:users!discipulados_discipulo_id_fkey(id, nome, email)
        `);

      // Se não for admin, filtrar apenas os discipulados relacionados ao usuário
      if (!isAdmin()) {
        query = query.or(`discipulador_id.eq.${user?.id},discipulo_id.eq.${user?.id}`);
      }

      const { data, error } = await query.order('criado_em', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedDiscipulados = data.map(item => ({
          id: item.id,
          discipulador_id: item.discipulador_id,
          discipulo_id: item.discipulo_id,
          created_at: item.criado_em,
          discipulador: item.discipulador,
          discipulo: item.discipulo
        }));
        setDiscipulados(formattedDiscipulados);
      }
    } catch (error: any) {
      console.error('Erro ao buscar discipulados:', error);
      toast.error('Erro ao carregar discipulados', {
        description: 'Não foi possível obter a lista de discipulados.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscipulados();
  }, [user]);

  const canCreateDiscipulado = isAdmin() || isDiscipulador();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Discipulados</h1>
            <p className="text-muted-foreground">
              Acompanhe e gerencie os relacionamentos de discipulado.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchDiscipulados} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
            </Button>
            {canCreateDiscipulado && (
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" /> Novo Discipulado
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
        ) : discipulados.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Nenhum discipulado encontrado</h3>
              <p className="text-muted-foreground">
                {canCreateDiscipulado 
                  ? 'Comece criando o primeiro relacionamento de discipulado.' 
                  : 'Você ainda não está participando de nenhum discipulado.'}
              </p>
              {canCreateDiscipulado && (
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" /> Criar Primeiro Discipulado
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discipulados.map((discipulado) => (
              <Card key={discipulado.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Discipulado
                  </CardTitle>
                  <CardDescription>
                    Iniciado em {new Date(discipulado.created_at).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">Discipulador</Badge>
                      <span>{discipulado.discipulador?.nome}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary">Discípulo</Badge>
                      <span>{discipulado.discipulo?.nome}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      0 encontros
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <BookOpen className="w-4 h-4 mr-1" />
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
