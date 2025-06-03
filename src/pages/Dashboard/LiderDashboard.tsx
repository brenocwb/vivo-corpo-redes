
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Calendar, Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function LiderDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    meusDiscipulos: 0,
    encontrosEsteM: 0,
    gruposLiderados: 0,
    proximosEncontros: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Buscar discípulos sob minha liderança
        const { data: discipulados } = await supabase
          .from('discipulados')
          .select('id')
          .eq('discipulador_id', user.id);

        // Buscar grupos que lidero
        const { data: grupos } = await supabase
          .from('grupos')
          .select('id')
          .eq('lider_id', user.id);

        // Buscar encontros do mês
        const { data: encontros } = await supabase
          .from('encontros')
          .select('id')
          .gte('data', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
          .lte('data', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString());

        setStats({
          meusDiscipulos: discipulados?.length || 0,
          encontrosEsteM: encontros?.length || 0,
          gruposLiderados: grupos?.length || 0,
          proximosEncontros: []
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
          <h1 className="text-2xl font-bold tracking-tight">Dashboard do Líder</h1>
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
        <h1 className="text-2xl font-bold tracking-tight">Dashboard do Líder</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta, {user?.nome}! Aqui está o resumo do seu ministério.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Meus Discípulos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.meusDiscipulos}</div>
            <p className="text-xs text-muted-foreground">
              Pessoas sob seu cuidado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Encontros Este Mês
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.encontrosEsteM}</div>
            <p className="text-xs text-muted-foreground">
              Reuniões realizadas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Grupos Liderados
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.gruposLiderados}</div>
            <p className="text-xs text-muted-foreground">
              Comunidades em seu cuidado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Encontros</CardTitle>
            <CardDescription>
              Seus compromissos agendados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4" />
              <p>Nenhum encontro agendado</p>
              <p className="text-sm">Que tal agendar um novo encontro?</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Progresso dos Discípulos</CardTitle>
            <CardDescription>
              Acompanhe o crescimento espiritual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-4 text-muted-foreground">
                <BookOpen className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">Dados de progresso serão exibidos aqui</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
