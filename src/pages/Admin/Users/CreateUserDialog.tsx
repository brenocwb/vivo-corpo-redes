
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserRole } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RegisterUserGuide from './RegisterUserGuide';

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}

export default function CreateUserDialog({ open, onOpenChange, onUserCreated }: CreateUserDialogProps) {
  const [activeTab, setActiveTab] = useState("form");
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('discipulo');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast('Erro', {
        description: 'Todos os campos são obrigatórios.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
      return;
    }
    
    setLoading(true);
    try {
      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Skip email verification
        user_metadata: { name }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Falha ao criar usuário na autenticação');
      }

      // Create user in database
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          nome: name,
          email,
          tipo_usuario: role,
          criado_em: new Date().toISOString()
        });

      if (dbError) throw dbError;

      toast('Usuário criado', {
        description: `${name} foi adicionado com sucesso!`
      });
      
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setRole('discipulo');
      
      onOpenChange(false);
      onUserCreated();
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast('Erro ao criar usuário', {
        description: error.message || 'Não foi possível criar o usuário.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: UserRole): string => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'discipulador': 
      case 'lider': return 'Discipulador/Líder';
      case 'discipulo': 
      case 'membro': return 'Discípulo/Membro';
      default: return role;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Cadastro</TabsTrigger>
            <TabsTrigger value="guide">Guia</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form">
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para adicionar um novo usuário ao sistema.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input 
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome completo"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Tipo</Label>
                <Select 
                  value={role} 
                  onValueChange={(value) => setRole(value as UserRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="discipulador">Discipulador/Líder</SelectItem>
                    <SelectItem value="discipulo">Discípulo/Membro</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  {role === 'admin' && "Administradores têm acesso completo ao sistema."}
                  {role === 'discipulador' && "Discipuladores podem gerenciar discípulos e grupos."}
                  {role === 'discipulo' && "Discípulos são membros que recebem mentoria."}
                </p>
              </div>
              
              <DialogFooter className="pt-4">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Criando..." : "Criar Usuário"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="guide">
            <RegisterUserGuide />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
