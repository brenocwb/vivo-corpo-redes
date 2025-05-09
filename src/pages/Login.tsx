
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
    } catch (error: any) {
      setError(error.message || 'Falha ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-full bg-corpovivo-600 flex items-center justify-center text-white font-semibold">
          CV
        </div>
        <h1 className="text-2xl font-bold text-corpovivo-600 dark:text-corpovivo-400">
          Corpo Vivo
        </h1>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl text-center">Bem-vindo!</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
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
                  Esqueceu sua senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-corpovivo-600 hover:bg-corpovivo-700"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <p className="mt-8 text-sm text-center text-muted-foreground">
        Plataforma exclusiva para membros do Corpo Vivo.
        <br />
        Se você não possui acesso, entre em contato com seu líder.
      </p>
    </div>
  );
}
