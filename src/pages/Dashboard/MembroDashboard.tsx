
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, MessageSquare, CalendarDays } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const mockData = {
  userName: 'Maria',
  planoAtual: {
    nome: 'Fundamentos da Fé',
    progresso: 60,
    proximaEtapa: 'Estudo da Oração',
  },
  proximoEncontro: {
    data: '18/05/2025',
    hora: '14:30',
    discipulador: 'Pastor João',
  },
  grupo: {
    nome: 'Vida Nova',
    lider: 'Ana Costa',
    diaEncontro: 'Quinta-feira',
  },
};

export default function MembroDashboard() {
  const [data, setData] = useState(mockData);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Olá, {data.userName}!</h1>
        <p className="text-muted-foreground">Bem-vindo à sua jornada de discipulado</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-corpovivo-600" />
              Seu Plano de Discipulado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="font-medium">{data.planoAtual.nome}</p>
                  <p className="text-sm text-muted-foreground">{data.planoAtual.progresso}%</p>
                </div>
                <Progress value={data.planoAtual.progresso} className="h-2" />
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <p className="font-medium mb-1">Próxima etapa</p>
                <p className="text-sm text-muted-foreground">{data.planoAtual.proximaEtapa}</p>
              </div>
              
              <Button className="w-full" variant="outline">
                Ver plano completo
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-corpovivo-600" />
              Próximo Encontro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-lg">
                    {data.proximoEncontro.data} às {data.proximoEncontro.hora}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Com {data.proximoEncontro.discipulador}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Confirmar
                </Button>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              Ver histórico de encontros
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-corpovivo-600" />
              Seu Grupo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <p className="font-medium">{data.grupo.nome}</p>
                <p className="text-sm text-muted-foreground">
                  Líder: {data.grupo.lider}
                </p>
                <p className="text-sm text-muted-foreground">
                  Encontros: {data.grupo.diaEncontro}
                </p>
              </div>
              <Button className="w-full" variant="outline">
                Ver detalhes do grupo
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-corpovivo-600" />
              Compartilhe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full" variant="secondary">
                Enviar pedido de oração
              </Button>
              <Button className="w-full" variant="secondary">
                Compartilhar testemunho
              </Button>
              <Button className="w-full" variant="outline">
                Ver comunidade
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
