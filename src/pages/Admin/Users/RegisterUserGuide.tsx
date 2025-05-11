
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const RegisterUserGuide: React.FC = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Guia de Cadastro de Usuários</CardTitle>
        <CardDescription>
          Aprenda como cadastrar diferentes tipos de usuários no sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Cadastrando um Administrador</h3>
          <ol className="list-decimal ml-6 space-y-1">
            <li>Acesse a página de Usuários através do menu lateral</li>
            <li>Clique no botão "Novo Usuário" no canto superior direito</li>
            <li>Preencha os campos Nome, E-mail e Senha</li>
            <li>Selecione o tipo "Admin" no campo Tipo</li>
            <li>Clique em "Criar Usuário" para finalizar</li>
          </ol>
          <p className="text-sm text-muted-foreground mt-2">
            <strong>Importante:</strong> Administradores têm acesso total ao sistema. Limite o número de 
            usuários com este privilégio.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Cadastrando um Discipulador</h3>
          <ol className="list-decimal ml-6 space-y-1">
            <li>Acesse a página de Usuários através do menu lateral</li>
            <li>Clique no botão "Novo Usuário" no canto superior direito</li>
            <li>Preencha os campos Nome, E-mail e Senha</li>
            <li>Selecione o tipo "Discipulador" ou "Líder" no campo Tipo</li>
            <li>Opcionalmente, associe o discipulador a um grupo existente</li>
            <li>Clique em "Criar Usuário" para finalizar</li>
          </ol>
          <p className="text-sm text-muted-foreground mt-2">
            <strong>Observação:</strong> Após criar um discipulador, você pode atribuir discípulos a ele 
            na página de Discipulados.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Cadastrando um Discípulo</h3>
          <ol className="list-decimal ml-6 space-y-1">
            <li>Acesse a página de Usuários através do menu lateral</li>
            <li>Clique no botão "Novo Usuário" no canto superior direito</li>
            <li>Preencha os campos Nome, E-mail e Senha</li>
            <li>Selecione o tipo "Discípulo" ou "Membro" no campo Tipo</li>
            <li>Opcionalmente, associe o discípulo a um grupo existente</li>
            <li>Clique em "Criar Usuário" para finalizar</li>
          </ol>
          <p className="text-sm text-muted-foreground mt-2">
            <strong>Próximos passos:</strong> Após criar um discípulo, você pode associá-lo a um discipulador 
            na página de Discipulados e atribuir um plano de estudo a ele.
          </p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
          <h4 className="font-semibold mb-2">Credenciais de Demonstração</h4>
          <p className="text-sm mb-3">
            Para fins de teste, você pode utilizar as seguintes contas:
          </p>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">Administrador:</div>
              <div>admin@corpovivo.com</div>
              <div>password123</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">Discipulador:</div>
              <div>discipulador@corpovivo.com</div>
              <div>password123</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">Discípulo:</div>
              <div>discipulo@corpovivo.com</div>
              <div>password123</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterUserGuide;
