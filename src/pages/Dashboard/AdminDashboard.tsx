
import { useState, useEffect } from 'react';
import { Users, Folder, BookOpen, CalendarDays } from 'lucide-react';
import { StatCard } from '@/components/ui/dashboard/StatCard';
import { RecentActivities } from '@/components/ui/dashboard/RecentActivities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardStats } from '@/types';

const mockDashboardData: DashboardStats = {
  totalDiscipulos: 48,
  totalLideres: 12,
  totalGrupos: 8,
  totalEncontros: 124,
  crescimentoMensal: [
    { mes: 'Jan', quantidade: 5 },
    { mes: 'Fev', quantidade: 4 },
    { mes: 'Mar', quantidade: 7 },
    { mes: 'Abr', quantidade: 3 },
    { mes: 'Mai', quantidade: 6 },
    { mes: 'Jun', quantidade: 8 },
  ]
};

const mockActivities = [
  {
    id: '1',
    title: 'Novo encontro registrado',
    description: 'João registrou encontro com Maria',
    timestamp: 'Há 2 horas',
    type: 'encontro' as const
  },
  {
    id: '2',
    title: 'Novo pedido de oração',
    description: 'Pedro solicitou oração por saúde',
    timestamp: 'Há 5 horas',
    type: 'oracao' as const
  },
  {
    id: '3',
    title: 'Testemunho compartilhado',
    description: 'Ana compartilhou um testemunho de cura',
    timestamp: 'Há 1 dia',
    type: 'testemunho' as const
  },
  {
    id: '4',
    title: 'Etapa de plano concluída',
    description: 'Lucas concluiu a etapa 3 de Fundamentos da Fé',
    timestamp: 'Há 2 dias',
    type: 'plano' as const
  }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(mockDashboardData);
  const [activities, setActivities] = useState(mockActivities);

  // Em uma implementação real, isso viria do Supabase
  useEffect(() => {
    // Carregaria os dados reais do dashboard aqui
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">Visão geral da plataforma Corpo Vivo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total de Discípulos" 
          value={stats.totalDiscipulos} 
          icon={<Users size={20} />}
          trend={{ value: 12, positive: true }}
        />
        <StatCard 
          title="Líderes" 
          value={stats.totalLideres} 
          icon={<Users size={20} />}
        />
        <StatCard 
          title="Grupos" 
          value={stats.totalGrupos} 
          icon={<Folder size={20} />}
        />
        <StatCard 
          title="Encontros Registrados" 
          value={stats.totalEncontros} 
          icon={<CalendarDays size={20} />}
          trend={{ value: 8, positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Crescimento Mensal</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.crescimentoMensal}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <RecentActivities activities={activities} />
      </div>
    </div>
  );
}
