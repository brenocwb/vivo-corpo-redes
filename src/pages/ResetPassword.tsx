
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (error) {
      console.error('Falha ao solicitar recuperação de senha:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <CardTitle className="text-xl text-center">Recuperar Senha</CardTitle>
          <CardDescription className="text-center">
            Digite o e-mail associado à sua conta para receber um link de redefinição.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center p-4">
              <p className="mb-4">
                Se o e-mail estiver cadastrado, você receberá um link de recuperação.
              </p>
              <p className="text-sm text-muted-foreground">
                Verifique sua caixa de entrada e a pasta de spam.
              </p>
            </div>
          ) : (
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
              <Button 
                type="submit" 
                className="w-full bg-corpovivo-600 hover:bg-corpovivo-700"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar link de recuperação'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/login" className="text-sm text-corpovivo-600 hover:underline">
            Voltar para o login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
