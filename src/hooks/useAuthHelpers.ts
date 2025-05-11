
import { useState } from 'react';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

export const useAuthHelpers = (setUser: React.Dispatch<React.SetStateAction<User | null>>) => {
  const navigate = useNavigate();
  
  const fetchAndSetUserData = async (email: string | undefined) => {
    if (!email) return;

    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (userError) {
        toast('Erro ao buscar dados do usuário', {
          description: userError.message,
          style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
        });
        throw userError;
      }

      if (!userData) {
        toast('Usuário não encontrado', {
          description: 'Verifique com seu líder se seu cadastro foi feito.',
          style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
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

export const useRoleHelpers = (user: User | null) => {
  // Funções auxiliares para verificação de papéis
  const isAdmin = () => user?.role === 'admin';
  const isDiscipulador = () => user?.role === 'discipulador' || user?.role === 'lider';
  const isDiscipulo = () => user?.role === 'discipulo' || user?.role === 'membro';
  const getUserRole = () => user?.role || null;
  
  return { isAdmin, isDiscipulador, isDiscipulo, getUserRole };
};
