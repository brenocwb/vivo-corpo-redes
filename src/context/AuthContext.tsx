
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { Session, SessionContextProvider } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';

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

  const signIn = async (email: string, password: string) => {
    // This will be implemented via Supabase integration
    toast({
      title: 'Conectando...',
      description: 'Aguarde enquanto validamos suas credenciais'
    });
  };

  const signOut = async () => {
    // This will be implemented via Supabase integration
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';
  const isLider = () => user?.role === 'lider';
  const isMembro = () => user?.role === 'membro';
  const getUserRole = () => user?.role || null;

  // This will be implemented properly when connected to Supabase
  useEffect(() => {
    setLoading(false);
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
