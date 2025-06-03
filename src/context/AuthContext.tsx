
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  isDiscipulador: () => boolean;
  isDiscipulo: () => boolean;
  getUserRole: () => UserRole | null;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Role check functions
  const isAdmin = (): boolean => user?.role === 'admin';
  const isDiscipulador = (): boolean => user?.role === 'discipulador' || user?.role === 'lider' || user?.role === 'admin';
  const isDiscipulo = (): boolean => user?.role === 'discipulo' || user?.role === 'membro';
  
  const getUserRole = (): UserRole | null => user?.role || null;

  const fetchUserData = async (userId: string) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        return;
      }

      if (userData) {
        const userObj: User = {
          id: userData.id,
          email: userData.email,
          nome: userData.nome,
          role: userData.tipo_usuario as UserRole,
          grupo_id: userData.grupo_id,
          created_at: userData.criado_em || new Date().toISOString()
        };
        setUser(userObj);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      if (initialSession?.user) {
        await fetchUserData(initialSession.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          await fetchUserData(session.user.id);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        toast.error('Erro no login', {
          description: error.message,
        });
        return { error };
      }

      if (data.user) {
        await fetchUserData(data.user.id);
        toast.success('Login realizado com sucesso!');
      }

      return { error: null };
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error('Erro no login', {
        description: error.message,
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        toast.error('Erro no cadastro', {
          description: error.message,
        });
        return { error };
      }

      toast.success('Cadastro realizado com sucesso!', {
        description: 'Verifique seu email para confirmar a conta.',
      });

      return { error: null };
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro no cadastro', {
        description: error.message,
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro no logout:', error);
        toast.error('Erro no logout', {
          description: error.message,
        });
      } else {
        setUser(null);
        setSession(null);
        toast.success('Logout realizado com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro no logout:', error);
      toast.error('Erro no logout', {
        description: error.message,
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error('Erro ao enviar email de recuperação', {
          description: error.message,
        });
        return { error };
      }

      toast.success('Email de recuperação enviado!', {
        description: 'Verifique sua caixa de entrada.',
      });

      return { error: null };
    } catch (error: any) {
      toast.error('Erro ao enviar email de recuperação', {
        description: error.message,
      });
      return { error };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isDiscipulador,
    isDiscipulo,
    getUserRole,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
