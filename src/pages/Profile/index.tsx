
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, KeyRound, Mail, Users, Calendar, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

export default function Profile() {
  const { user } = useAuth();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast('As senhas não coincidem', {
        description: 'A nova senha e a confirmação não são iguais.',
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast('Senha muito curta', {
        description: 'A senha deve ter pelo menos 6 caracteres.',
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast('Senha alterada com sucesso', {
        description: 'Sua senha foi atualizada.'
      });
      
      setNewPassword('');
      setConfirmPassword('');
      setChangePasswordOpen(false);
      
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      toast('Erro ao alterar senha', {
        description: error.message || 'Não foi possível alterar sua senha.',
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'lider': return 'Líder';
      case 'membro': return 'Membro';
      default: return role;
    }
  };
  
  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p>Carregando dados do usuário...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Informações do Usuário
              </CardTitle>
              <CardDescription>
                Seus dados pessoais na plataforma Corpo Vivo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    {user.nome}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                  <p className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    {user.email}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Tipo de Usuário</p>
                  <p className="flex items-center">
                    <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                      user.role === 'lider' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Data de Cadastro</p>
                  <p className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {formatDate(user.created_at)}
                  </p>
                </div>
                
                {user.grupo_id && (
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Grupo</p>
                    <p className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      {/* Aqui poderia mostrar o nome do grupo, precisaria buscar do banco */}
                      {user.grupo_id}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full md:w-auto"
                onClick={() => setChangePasswordOpen(true)}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Alterar Senha
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input 
                id="new-password" 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="●●●●●●"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="●●●●●●"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setChangePasswordOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleChangePassword}
              disabled={loading}
            >
              {loading ? 'Alterando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
