import { createContext, useContext, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
  isDiscipulador: boolean;
  isDiscipulo: boolean;
  getUserRole: () => UserRole | null;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Função para buscar dados do usuário na tabela pública
  const fetchUserData = useCallback(async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        throw error || new Error('Usuário não encontrado');
      }

      return {
        id: userId,
        email,
        nome: data.nome || '',
        tipo_usuario: data.tipo_usuario,
        avatar_url: data.avatar_url || '',
        created_at: data.created_at
      } as User;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      throw error;
    }
  }, []);

  // Função principal de login
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      toast.loading('Validando credenciais...');

      // 1. Autenticação no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError || !authData.user) {
        throw authError || new Error('Falha na autenticação');
      }

      // 2. Busca dados adicionais do usuário
      const userData = await fetchUserData(authData.user.id, email);
      setUser(userData);

      // 3. Redirecionamento baseado no tipo de usuário
      const redirectPath = userData.tipo_usuario === 'admin' 
        ? '/dashboard' 
        : userData.tipo_usuario === 'discipulador' 
          ? '/discipulador' 
          : '/discipulo';

      navigate(redirectPath);
      toast.success(`Bem-vindo, ${userData.nome || 'usuário'}!`);

    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error(error.message || 'Credenciais inválidas');
      await supabase.auth.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      navigate('/login');
      toast.info('Você foi desconectado');
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      toast.error('Erro ao desconectar');
    } finally {
      setLoading(false);
    }
  };

  // Função para resetar senha
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
      
      toast.success('E-mail de recuperação enviado!');
    } catch (error: any) {
      console.error('Erro ao resetar senha:', error);
      toast.error(error.message || 'Erro ao enviar e-mail de recuperação');
    } finally {
      setLoading(false);
    }
  };

  // Verificações de tipo de usuário
  const isAdmin = user?.tipo_usuario === 'admin';
  const isDiscipulador = user?.tipo_usuario === 'discipulador';
  const isDiscipulo = user?.tipo_usuario === 'discipulo';
  const getUserRole = () => user?.tipo_usuario || null;

  // Efeito para gerenciar estado de autenticação
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const userData = await fetchUserData(session.user.id, session.user.email!);
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Verifica sessão ao carregar
    checkSession();

    // Observa mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userData = await fetchUserData(session.user.id, session.user.email!);
          setUser(userData);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
