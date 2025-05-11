
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import AdminUsers from './index';

// Guide component for user management
const UserManagementGuide = () => (
  <Card>
    <CardHeader>
      <CardTitle>Gerenciamento de Usuários</CardTitle>
      <CardDescription>
        Guia para gerenciar usuários no sistema Corpo Vivo
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <h3 className="font-bold mb-2">Tipos de Usuários</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li>
            <span className="font-medium">Admin</span> - Acesso total ao sistema, pode gerenciar todos os usuários, grupos, discipulados e planos.
          </li>
          <li>
            <span className="font-medium">Discipulador</span> - Pode liderar grupos e discipular outros membros. Tem acesso à gestão do seu grupo e seus discípulos.
          </li>
          <li>
            <span className="font-medium">Discípulo</span> - Membro que participa de grupos e é discipulado. Tem acesso a seus planos e ao seu grupo.
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-bold mb-2">Como Cadastrar um Novo Usuário</h3>
        <ol className="list-decimal ml-6 space-y-1">
          <li>Clique no botão "Novo Usuário" na parte superior direita da lista de usuários.</li>
          <li>Preencha todos os campos obrigatórios (Nome, Email, Senha e Tipo).</li>
          <li>Atribua o tipo de usuário adequado conforme a função da pessoa.</li>
          <li>Clique em "Criar Usuário" para finalizar o cadastro.</li>
        </ol>
      </div>

      <div>
        <h3 className="font-bold mb-2">Boas Práticas</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li>Mantenha o número de administradores limitado para melhor segurança.</li>
          <li>Revise periodicamente os usuários cadastrados e seus níveis de acesso.</li>
          <li>Ao cadastrar novos discipuladores, certifique-se de atribuí-los a grupos adequados.</li>
          <li>Ao desativar um usuário, considere transferir seus discípulos para outro discipulador.</li>
        </ul>
      </div>
    </CardContent>
  </Card>
);

export default function UserManagementPage() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("users");

  if (!isAdmin()) {
    return <div className="p-8">Acesso não autorizado.</div>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">
            Administre os usuários do sistema Corpo Vivo e seus respectivos níveis de acesso.
          </p>
        </div>

        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="guide">Guia de Gerenciamento</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>
          <TabsContent value="guide">
            <UserManagementGuide />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
