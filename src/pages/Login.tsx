
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Login() {
  const { user, signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Registration state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Already authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Login with provided credentials
      const result = await signIn(email, password);
      
      if (result && 'error' in result && result.error) {
        throw new Error(result.error.message);
      }
      
      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      toast.error("Falha ao fazer login", { 
        description: error.message || "Verifique suas credenciais e tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
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
      
      // Create the user in Supabase Auth
      const authResult = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          data: {
            nome: registerName
          }
        }
      });
      
      if (authResult && 'error' in authResult && authResult.error) {
        throw new Error(authResult.error.message);
      }
      
      if (authResult.data.user) {
        // Create entry in users table with role 'membro' (discipulo)
        const { error: userError } = await supabase.from('users').insert({
          id: authResult.data.user.id,
          nome: registerName,
          email: registerEmail,
          tipo_usuario: 'membro' // Default role is regular member/discipulo
        });
        
        if (userError) throw new Error(userError.message);
        
        toast.success("Registro realizado com sucesso!", {
          description: "Você já pode fazer login com suas credenciais."
        });
        
        // Switch to login tab
        setActiveTab("login");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterName("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast.error("Falha ao criar conta", {
        description: error.message || "Ocorreu um erro ao registrar sua conta."
      });
    } finally {
      setIsSubmitting(false);
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
      const { error } = await signIn(demoEmail, demoPassword);
      
      if (error) {
        // Login failed, try to create the demo account
        await createDemoUser(role, demoEmail, demoPassword);
        
        // Try login again after creating demo user
        await signIn(demoEmail, demoPassword);
      }
      
      toast.success(`Login de demonstração como ${role} realizado com sucesso!`);
    } catch (error: any) {
      toast.error("Falha no login de demonstração", {
        description: error.message || "Ocorreu um erro ao fazer login de demonstração."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 rounded-full bg-corpovivo-600 flex items-center justify-center text-white font-semibold text-xl">
            CV
          </div>
          <h1 className="text-2xl font-bold mt-2 text-corpovivo-600 dark:text-corpovivo-400">Corpo Vivo</h1>
          <p className="text-gray-500 dark:text-gray-400">Sistema de Gestão de Discipulado</p>
        </div>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Entre com seu email e senha para acessar o sistema.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      <Link to="/reset-password" className="text-xs text-corpovivo-600 hover:underline">
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Entrando..." : "Entrar"}
                  </Button>
                  
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
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
