
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthHelpers, useRoleHelpers } from '@/hooks/useAuthHelpers';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: () => boolean;
  isDiscipulador: () => boolean;
  isDiscipulo: () => boolean;
  getUserRole: () => UserRole | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  isAdmin: () => false,
  isDiscipulador: () => false,
  isDiscipulo: () => false,
  getUserRole: () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser, loading, setLoading } = useAuthState();
  const { fetchAndSetUserData, navigate } = useAuthHelpers(setUser);
  const { isAdmin, isDiscipulador, isDiscipulo, getUserRole } = useRoleHelpers(user);

  const signIn = async (email: string, password: string) => {
    try {
      toast('Conectando...', {
        description: 'Aguarde enquanto validamos suas credenciais'
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast('Erro ao conectar', {
          description: error.message,
          style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
        });
        throw error;
      }

      if (data?.user) {
        await fetchAndSetUserData(data.user.email);
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      toast('Falha ao conectar', {
        description: 'Verifique seu e-mail e senha e tente novamente.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/login');
      toast('Desconectado', {
        description: 'Você saiu do sistema com sucesso.'
      });
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      toast('Erro ao desconectar', {
        description: 'Não foi possível sair do sistema.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) {
        toast('Erro ao solicitar recuperação de senha', {
          description: error.message,
          style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
        });
        throw error;
      }

      toast('Recuperação de senha enviada', {
        description: 'Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.'
      });

    } catch (error: any) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      toast('Falha na recuperação de senha', {
        description: 'Tente novamente mais tarde.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    }
  };

  // Initialize auth state
  useEffect(() => {
    setLoading(true);

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Use setTimeout to prevent recursive issues
          setTimeout(async () => {
            await fetchAndSetUserData(session.user.email);
          }, 0);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setTimeout(async () => {
          await fetchAndSetUserData(session.user.email);
          setLoading(false);
        }, 0);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        resetPassword,
        isAdmin,
        isDiscipulador,
        isDiscipulo,
        getUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
