
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Bell, Shield, Database } from 'lucide-react';
import { toast } from 'sonner';

export default function Configuracoes() {
  const { user, isAdmin } = useAuth();
  const [notificacoes, setNotificacoes] = useState(true);
  const [notificacoesEmail, setNotificacoesEmail] = useState(false);

  const handleSaveSettings = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  if (!isAdmin()) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema e preferências.
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
              <CardDescription>
                Configure como você deseja receber notificações.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações no navegador
                  </p>
                </div>
                <Switch
                  checked={notificacoes}
                  onCheckedChange={setNotificacoes}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações por email
                  </p>
                </div>
                <Switch
                  checked={notificacoesEmail}
                  onCheckedChange={setNotificacoesEmail}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança
              </CardTitle>
              <CardDescription>
                Configurações de segurança e privacidade.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Digite sua senha atual"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Digite sua nova senha"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirme sua nova senha"
                />
              </div>
              <Button variant="outline">
                Alterar Senha
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Sistema
              </CardTitle>
              <CardDescription>
                Configurações gerais do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="church-name">Nome da Igreja</Label>
                <Input
                  id="church-name"
                  placeholder="Corpo Vivo"
                  defaultValue="Corpo Vivo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Frequência de Backup</Label>
                <Input
                  id="backup-frequency"
                  placeholder="Diário"
                  defaultValue="Diário"
                />
              </div>
              <Button variant="outline">
                Backup Manual
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>
              <Settings className="w-4 h-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
