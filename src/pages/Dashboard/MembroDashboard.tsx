
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, Heart, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function MembroDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    meuProgresso: 0,
    proximosEncontros: 0,
    meuGrupo: null,
    planosAtivos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Buscar meu discipulado (como discípulo)
        const { data: meuDiscipulado } = await supabase
          .from('discipulados')
          .select('*')
          .eq('discipulo_id', user.id)
          .single();

        // Buscar meu grupo
        const { data: meuGrupo } = await supabase
          .from('grupos')
          .select('nome')
          .eq('id', user.grupo_id)
          .single();

        // Buscar progresso dos planos
        const { data: progresso } = await supabase
          .from('progresso_planos')
          .select('*')
          .eq('user_id', user.id);

        setStats({
          meuProgresso: progresso?.length || 0,
          proximosEncontros: 0,
          meuGrupo: meuGrupo?.nome || null,
          planosAtivos: progresso?.length || 0
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meu Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo de volta, {user?.nome}!</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-8 bg-muted rounded w-16"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Meu Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta, {user?.nome}! Continue sua jornada de crescimento espiritual.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Meu Progresso
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.meuProgresso}%</div>
            <p className="text-xs text-muted-foreground">
              Planos de discipulado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Próximos Encontros
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.proximosEncontros}</div>
            <p className="text-xs text-muted-foreground">
              Esta semana
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Meu Grupo
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">
              {stats.meuGrupo || 'Não definido'}
            </div>
            <p className="text-xs text-muted-foreground">
              Comunidade de fé
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Meu Plano de Crescimento</CardTitle>
            <CardDescription>
              Acompanhe seu desenvolvimento espiritual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="mx-auto h-12 w-12 mb-4" />
              <p>Nenhum plano ativo</p>
              <p className="text-sm">Converse com seu discipulador para iniciar um plano</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Suas últimas interações na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-4 text-muted-foreground">
                <Heart className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">Suas atividades aparecerão aqui</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
