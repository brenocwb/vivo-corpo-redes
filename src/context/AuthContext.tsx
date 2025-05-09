
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
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
  isAdmin: () => false,
  isLider: () => false,
  isMembro: () => false,
  getUserRole: () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    try {
      toast({
        title: 'Conectando...',
        description: 'Aguarde enquanto validamos suas credenciais'
      });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: 'Erro ao conectar',
          description: error.message,
          variant: 'destructive'
        });
        throw error;
      }
      
      if (data?.user) {
        // Fetch user data from our users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', data.user.email)
          .single();
        
        if (userError) {
          toast({
            title: 'Erro ao buscar dados do usuário',
            description: userError.message,
            variant: 'destructive'
          });
          throw userError;
        }
        
        setUser({
          id: userData.id,
          nome: userData.nome,
          email: userData.email,
          role: userData.tipo_usuario as UserRole,
          grupo_id: userData.grupo_id
        });
        
        toast({
          title: 'Conectado com sucesso',
          description: `Bem-vindo, ${userData.nome}!`
        });
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast({
        title: 'Falha ao conectar',
        description: 'Verifique seu e-mail e senha e tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/login');
      toast({
        title: 'Desconectado',
        description: 'Você saiu do sistema com sucesso.'
      });
    } catch (error) {
      console.error('Erro ao desconectar:', error);
    }
  };

  const isAdmin = () => user?.role === 'admin';
  const isLider = () => user?.role === 'lider';
  const isMembro = () => user?.role === 'membro';
  const getUserRole = () => user?.role || null;

  useEffect(() => {
    setLoading(true);
    
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Fetch user data from our users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .maybeSingle();
          
          if (userData) {
            setUser({
              id: userData.id,
              nome: userData.nome,
              email: userData.email,
              role: userData.tipo_usuario as UserRole,
              grupo_id: userData.grupo_id
            });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Check the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch user data from our users table after a small delay
        setTimeout(async () => {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .maybeSingle();
          
          if (userData) {
            setUser({
              id: userData.id,
              nome: userData.nome,
              email: userData.email,
              role: userData.tipo_usuario as UserRole,
              grupo_id: userData.grupo_id
            });
          } else {
            setUser(null);
          }
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
