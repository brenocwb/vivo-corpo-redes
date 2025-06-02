
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface RegistrationFormProps {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  onRegistrationSuccess: () => void;
}

export function RegistrationForm({ isSubmitting, setIsSubmitting, onRegistrationSuccess }: RegistrationFormProps) {
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!registerName || !registerEmail || !registerPassword || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    if (registerPassword !== confirmPassword) {
      toast.error("As senhas não conferem");
      return;
    }
    
    if (registerPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log('Registrando usuário:', registerEmail);
      
      // Create the user in Supabase Auth
      const authResult = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            nome: registerName,
            tipo_usuario: 'membro'
          }
        }
      });
      
      if (authResult.error) {
        console.error('Erro no registro:', authResult.error);
        throw new Error(authResult.error.message);
      }
      
      if (authResult.data.user) {
        console.log('Usuário criado com sucesso:', authResult.data.user.id);
        
        toast.success("Registro realizado com sucesso!", {
          description: "Você já pode fazer login com suas credenciais."
        });
        
        // Clear form and switch to login tab
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterName("");
        setConfirmPassword("");
        onRegistrationSuccess();
      }
    } catch (error: any) {
      console.error('Erro no registro:', error);
      
      let errorMessage = "Ocorreu um erro ao registrar sua conta.";
      if (error.message?.includes('already registered')) {
        errorMessage = "Este e-mail já está registrado.";
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = "E-mail inválido.";
      }
      
      toast.error("Falha ao criar conta", {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastro</CardTitle>
        <CardDescription>
          Crie sua conta para acessar o sistema.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-name">Nome</Label>
            <Input
              id="register-name"
              placeholder="Seu nome completo"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              placeholder="seu@email.com"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password">Senha</Label>
            <Input
              id="register-password"
              type="password"
              placeholder="••••••••"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirme a Senha</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
