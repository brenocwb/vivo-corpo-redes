
import { createContext, useContext, useEffect, ReactNode, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/integrations/supabase/types';

// Tipos específicos para o contexto de autenticação
type UserRole = 'admin' | 'discipulador' | 'discipulo' | 'lider' | 'membro';

interface AuthContextType {
  user: Tables<'users'> | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
  isDiscipulador: boolean;
  isDiscipulo: boolean;
  getUserRole: () => UserRole | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Tables<'users'> | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Função para buscar dados completos do usuário
  const fetchUserData = useCallback(async (userId: string): Promise<Tables<'users'> | null> => {
    try {
      console.log('Buscando dados do usuário:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar usuário:', error);
        return null;
      }

      console.log('Dados do usuário encontrados:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  }, []);

  // Função principal de login
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Iniciando login para:', email);

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Erro de autenticação:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Usuário não encontrado após login');
      }

      console.log('Login realizado com sucesso:', authData.user.id);

      // Buscar dados do usuário na tabela users
      const userData = await fetchUserData(authData.user.id);
      if (!userData) {
        console.log('Criando perfil de usuário automaticamente...');
        // Se não encontrar o usuário, pode ser que o trigger não funcionou
        // Vamos tentar criar manualmente
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email!,
            nome: authData.user.user_metadata?.nome || authData.user.email!.split('@')[0],
            tipo_usuario: 'membro'
          })
          .select()
          .single();

        if (insertError) {
          console.error('Erro ao criar usuário:', insertError);
          throw new Error('Erro ao criar perfil do usuário');
        }

        setUser(newUser);
      } else {
        setUser(userData);
      }

      toast.success(`Bem-vindo, ${userData?.nome || authData.user.email}!`);

      // Redirecionamento baseado no tipo de usuário
      const userType = userData?.tipo_usuario || 'membro';
      const redirectPath = userType === 'admin' 
        ? '/dashboard' 
        : userType === 'discipulador' || userType === 'lider'
          ? '/discipulado' 
          : '/dashboard';

      console.log('Redirecionando para:', redirectPath);
      navigate(redirectPath);

    } catch (error: any) {
      console.error('Erro no login:', error);
      
      let errorMessage = 'Erro ao fazer login';
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'E-mail ou senha incorretos';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'E-mail não confirmado. Verifique sua caixa de entrada.';
      }
      
      toast.error(errorMessage);
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
      console.log('Fazendo logout...');
      
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
  const isDiscipulador = user?.tipo_usuario === 'discipulador' || user?.tipo_usuario === 'lider' || user?.tipo_usuario === 'admin';
  const isDiscipulo = user?.tipo_usuario === 'discipulo' || user?.tipo_usuario === 'membro';
  
  const getUserRole = (): UserRole | null => {
    return user?.tipo_usuario as UserRole || null;
  };

  // Efeito para gerenciar estado de autenticação
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Verificando sessão inicial...');
        setLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Sessão atual:', session?.user?.id);

        if (session?.user) {
          const userData = await fetchUserData(session.user.id);
          setUser(userData || null);
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
        console.log('Mudança de estado de auth:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          const userData = await fetchUserData(session.user.id);
          setUser(userData || null);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
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
