
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Encontro } from '@/types';

interface RecentActivitiesProps {
  activities: {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type: 'encontro' | 'oracao' | 'testemunho' | 'plano';
  }[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>
          As atividades mais recentes na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              activity.type === 'encontro' ? 'bg-blue-100 text-blue-600' :
              activity.type === 'oracao' ? 'bg-purple-100 text-purple-600' :
              activity.type === 'testemunho' ? 'bg-orange-100 text-orange-600' :
              'bg-green-100 text-green-600'
            }`}>
              {activity.type === 'encontro' ? '📅' :
              activity.type === 'oracao' ? '🙏' :
              activity.type === 'testemunho' ? '🙌' : '📚'}
            </div>
            <div className="grid gap-1">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-muted-foreground">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
