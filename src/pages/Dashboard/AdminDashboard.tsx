
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardStats } from '@/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDiscipulos: 0,
    totalLideres: 0,
    totalGrupos: 0,
    totalEncontros: 0,
    crescimentoMensal: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Buscar estatísticas dos usuários
        const { data: usuarios } = await supabase
          .from('users')
          .select('tipo_usuario');

        // Buscar grupos
        const { data: grupos } = await supabase
          .from('grupos')
          .select('id');

        // Buscar encontros
        const { data: encontros } = await supabase
          .from('encontros')
          .select('id');

        // Buscar discipulados
        const { data: discipulados } = await supabase
          .from('discipulados')
          .select('id');

        if (usuarios) {
          const lideres = usuarios.filter(u => ['admin', 'lider', 'discipulador'].includes(u.tipo_usuario)).length;
          const discipulos = usuarios.filter(u => ['discipulo', 'membro'].includes(u.tipo_usuario)).length;

          setStats({
            totalDiscipulos: discipulos,
            totalLideres: lideres,
            totalGrupos: grupos?.length || 0,
            totalEncontros: encontros?.length || 0,
            crescimentoMensal: []
          });
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">Visão geral da plataforma Corpo Vivo</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-4 w-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-1"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">
          Visão geral da plataforma Corpo Vivo
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Discípulos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDiscipulos}</div>
            <p className="text-xs text-muted-foreground">
              Membros ativos na plataforma
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Líderes e Discipuladores
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLideres}</div>
            <p className="text-xs text-muted-foreground">
              Líderes servindo a comunidade
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Grupos Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGrupos}</div>
            <p className="text-xs text-muted-foreground">
              Grupos de comunhão
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Encontros Realizados
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEncontros}</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
            <CardDescription>
              Resumo das atividades da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Usuários Ativos</span>
                <span className="text-sm text-muted-foreground">
                  {stats.totalDiscipulos + stats.totalLideres}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Taxa de Crescimento</span>
                <span className="text-sm text-green-600">+12%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Engajamento</span>
                <span className="text-sm text-muted-foreground">Alto</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Tarefas administrativas importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center p-2 rounded-md bg-muted">
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="text-sm">Revisar novos planos</span>
              </div>
              <div className="flex items-center p-2 rounded-md bg-muted">
                <Users className="h-4 w-4 mr-2" />
                <span className="text-sm">Aprovar novos membros</span>
              </div>
              <div className="flex items-center p-2 rounded-md bg-muted">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">Agendar reunião de líderes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
