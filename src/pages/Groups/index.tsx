
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Users, MapPin, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Grupo } from '@/types';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Groups() {
  const { user, isAdmin } = useAuth();
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('grupos')
        .select(`
          *,
          lider:users!grupos_lider_id_fkey(nome)
        `)
        .order('nome', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedGroups = data.map(group => ({
          id: group.id,
          nome: group.nome,
          lider_id: group.lider_id,
          local: group.local,
          dia_semana: group.dia_semana,
          created_at: group.criado_em,
          lider: group.lider
        }));
        setGrupos(formattedGroups);
      }
    } catch (error: any) {
      console.error('Erro ao buscar grupos:', error);
      toast.error('Erro ao carregar grupos', {
        description: 'Não foi possível obter a lista de grupos.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Grupos</h1>
            <p className="text-muted-foreground">
              Gerencie os grupos da comunidade Corpo Vivo.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchGroups} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
            </Button>
            {isAdmin() && (
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" /> Novo Grupo
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
        ) : grupos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Nenhum grupo encontrado</h3>
              <p className="text-muted-foreground">
                {isAdmin() ? 'Comece criando o primeiro grupo da comunidade.' : 'Não há grupos disponíveis no momento.'}
              </p>
              {isAdmin() && (
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" /> Criar Primeiro Grupo
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grupos.map((grupo) => (
              <Card key={grupo.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {grupo.nome}
                  </CardTitle>
                  <CardDescription>
                    Líder: {grupo.lider?.nome || 'Não definido'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {grupo.local && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {grupo.local}
                    </div>
                  )}
                  
                  {grupo.dia_semana && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {grupo.dia_semana}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="outline">
                      0 membros
                    </Badge>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Ver Detalhes
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
