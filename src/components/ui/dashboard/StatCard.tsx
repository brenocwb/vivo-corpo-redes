
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {trend && (
              <p className={`text-xs flex items-center mt-1 ${
                trend.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.positive ? '↑' : '↓'} {trend.value}%{' '}
                <span className="text-muted-foreground ml-1">vs. último mês</span>
              </p>
            )}
          </div>
          <div className="p-2 rounded-full bg-corpovivo-100 text-corpovivo-600">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
