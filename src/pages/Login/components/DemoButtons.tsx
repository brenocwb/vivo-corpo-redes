
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface DemoButtonsProps {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export function DemoButtons({ isSubmitting, setIsSubmitting }: DemoButtonsProps) {
  const { signIn } = useAuth();

  const createDemoUser = async (role: 'admin' | 'lider' | 'membro', email: string, password: string) => {
    // Create demo user in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome: role.charAt(0).toUpperCase() + role.slice(1) // Capitalize first letter
        }
      }
    });
    
    if (authError) throw new Error(authError.message);
    
    if (authData.user) {
      // Create entry in users table with appropriate role
      const { error: userError } = await supabase.from('users').insert({
        id: authData.user.id,
        nome: role.charAt(0).toUpperCase() + role.slice(1),
        email,
        tipo_usuario: role
      });
      
      if (userError) throw new Error(userError.message);
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'lider' | 'membro') => {
    try {
      setIsSubmitting(true);
      
      let demoEmail: string;
      let demoPassword: string;
      
      switch (role) {
        case 'admin':
          demoEmail = "admin@corpovivo.com";
          demoPassword = "admin123";
          break;
        case 'lider':
          demoEmail = "lider@corpovivo.com";
          demoPassword = "lider123";
          break;
        default: // membro
          demoEmail = "membro@corpovivo.com";
          demoPassword = "membro123";
          break;
      }
      
      // Try to login
      try {
        await signIn(demoEmail, demoPassword);
        toast.success(`Login de demonstração como ${role} realizado com sucesso!`);
      } catch (loginError: any) {
        // Login failed, try to create the demo account
        await createDemoUser(role, demoEmail, demoPassword);
        
        // Try login again after creating demo user
        await signIn(demoEmail, demoPassword);
        toast.success(`Login de demonstração como ${role} realizado com sucesso!`);
      }
    } catch (error: any) {
      toast.error("Falha no login de demonstração", {
        description: error.message || "Ocorreu um erro ao fazer login de demonstração."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <p className="text-center text-sm text-muted-foreground mb-2">
        Acesso de demonstração
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        <Button 
          type="button" 
          variant="outline"
          size="sm"
          onClick={() => handleDemoLogin('admin')}
          disabled={isSubmitting}
        >
          Admin Demo
        </Button>
        <Button 
          type="button" 
          variant="outline"
          size="sm"
          onClick={() => handleDemoLogin('lider')}
          disabled={isSubmitting}
        >
          Líder Demo
        </Button>
        <Button 
          type="button" 
          variant="outline"
          size="sm"
          onClick={() => handleDemoLogin('membro')}
          disabled={isSubmitting}
        >
          Membro Demo
        </Button>
      </div>
    </div>
  );
}
