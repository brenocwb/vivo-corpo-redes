
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: () => boolean;
  isLider: () => boolean;
  isMembro: () => boolean;
  getUserRole: () => UserRole | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  isAdmin: () => false,
  isLider: () => false,
  isMembro: () => false,
  getUserRole: () => null,
});

// Separate hooks and utilities to make the component more focused
const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  return { user, setUser, loading, setLoading };
};

const useAuthHelpers = (setUser: React.Dispatch<React.SetStateAction<User | null>>) => {
  const navigate = useNavigate();
  
  const fetchAndSetUserData = async (email: string | undefined) => {
  if (!email) return;

  try {
    const { data: userData, error: userError } = await supabase
      .from('usuarios') // <- tabela correta
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (userError) {
      toast('Erro ao buscar dados do usuário', {
        description: userError.message,
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
      throw userError;
    }

    if (!userData) {
      toast('Usuário não encontrado', {
        description: 'Verifique com seu líder se seu cadastro foi feito.',
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
      return;
    }

    const userObj: User = {
      id: userData.id,
      nome: userData.nome,
      email: userData.email,
      role: userData.tipo_usuario as UserRole,
      grupo_id: userData.grupo_id,
      created_at: userData.criado_em
    };

    setUser(userObj);

    toast('Conectado com sucesso', {
      description: `Bem-vindo, ${userData.nome}!`
    });
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
  }
};

  
  return { fetchAndSetUserData, navigate };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser, loading, setLoading } = useAuthState();
  const { fetchAndSetUserData, navigate } = useAuthHelpers(setUser);

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
          style: { backgroundColor: 'hsl(var(--destructive))' }
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
        style: { backgroundColor: 'hsl(var(--destructive))' }
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
        style: { backgroundColor: 'hsl(var(--destructive))' }
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
          style: { backgroundColor: 'hsl(var(--destructive))' }
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
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    }
  };

  // User role helper functions
  const isAdmin = () => user?.role === 'admin';
  const isLider = () => user?.role === 'lider';
  const isMembro = () => user?.role === 'membro';
  const getUserRole = () => user?.role || null;

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
        isLider,
        isMembro,
        getUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
