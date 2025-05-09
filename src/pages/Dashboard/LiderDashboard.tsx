
import { useState, useEffect } from 'react';
import { Users, BookOpen, CalendarDays, AlertTriangle } from 'lucide-react';
import { StatCard } from '@/components/ui/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecentActivities } from '@/components/ui/dashboard/RecentActivities';

const mockStats = {
  totalDiscipulos: 5,
  totalEncontros: 18,
  diasSemEncontro: 5,
  alertas: 2
};

const mockProximosEncontros = [
  { id: '1', discipulo: 'Maria Silva', data: '15/05/2025', hora: '15:00' },
  { id: '2', discipulo: 'João Pereira', data: '17/05/2025', hora: '10:30' },
  { id: '3', discipulo: 'Ana Costa', data: '20/05/2025', hora: '18:45' }
];

const mockActivities = [
  {
    id: '1',
    title: 'Encontro realizado',
    description: 'Você registrou encontro com Maria',
    timestamp: 'Há 3 dias',
    type: 'encontro' as const
  },
  {
    id: '2',
    title: 'Nova etapa concluída',
    description: 'João concluiu a etapa "Batismo" do plano',
    timestamp: 'Há 4 dias',
    type: 'plano' as const
  },
  {
    id: '3',
    title: 'Pedido de oração',
    description: 'Ana solicitou oração por sua família',
    timestamp: 'Há 1 semana',
    type: 'oracao' as const
  }
];

export default function LiderDashboard() {
  const [stats, setStats] = useState(mockStats);
  const [proximosEncontros, setProximosEncontros] = useState(mockProximosEncontros);
  const [activities, setActivities] = useState(mockActivities);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Dashboard do Discipulador</h1>
        <p className="text-muted-foreground">Acompanhe seus discípulos e próximas atividades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Meus Discípulos" 
          value={stats.totalDiscipulos} 
          icon={<Users size={20} />}
        />
        <StatCard 
          title="Encontros Realizados" 
          value={stats.totalEncontros} 
          icon={<CalendarDays size={20} />}
        />
        <StatCard 
          title="Dias Sem Encontro" 
          value={stats.diasSemEncontro} 
          icon={<CalendarDays size={20} />}
        />
        <StatCard 
          title="Alertas" 
          value={stats.alertas} 
          icon={<AlertTriangle size={20} />}
          className="bg-red-50 border-red-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Próximos Encontros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proximosEncontros.map((encontro) => (
                <div key={encontro.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div>
                    <p className="font-medium">{encontro.discipulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {encontro.data} às {encontro.hora}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Confirmar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <RecentActivities activities={activities} />

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Discípulos que Precisam de Atenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-600" />
                  <p className="font-medium text-amber-800">João Pereira</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  15 dias sem encontro registrado
                </p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-600" />
                  <p className="font-medium text-amber-800">Ana Costa</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Sem progresso no plano há 3 semanas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Button } from '@/components/ui/button';
