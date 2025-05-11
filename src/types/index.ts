
export type UserRole = 'admin' | 'lider' | 'membro' | 'discipulador' | 'discipulo';

export interface User {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  grupo_id?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Grupo {
  id: string;
  nome: string;
  descricao?: string;
  lider_id: string;
  membros?: User[];
  created_at: string;
}

export interface Discipulado {
  id: string;
  discipulador_id: string;
  discipulo_id: string;
  plano_id?: string;
  created_at: string;
  discipulador?: User;
  discipulo?: User;
}

export interface Encontro {
  id: string;
  discipulado_id: string;
  data: string;
  tema: string;
  anotacoes?: string;
  created_at: string;
}

export interface Plano {
  id: string;
  titulo: string;
  descricao?: string;
  etapas: PlanoEtapa[];
  created_at: string;
}

export interface PlanoEtapa {
  id: string;
  titulo: string;
  descricao?: string;
  ordem: number;
  recursos?: string[];
}

export interface ProgressoPlano {
  id: string;
  discipulado_id: string;
  plano_id: string;
  etapa_id: string;
  concluido: boolean;
  data_conclusao?: string;
  created_at: string;
}

export interface PedidoOracao {
  id: string;
  usuario_id: string;
  conteudo: string;
  publico: boolean;
  usuario?: User;
  created_at: string;
}

export interface Testemunho {
  id: string;
  usuario_id: string;
  titulo: string;
  conteudo: string;
  usuario?: User;
  created_at: string;
}

export interface DashboardStats {
  totalDiscipulos: number;
  totalLideres: number;
  totalGrupos: number;
  totalEncontros: number;
  crescimentoMensal: {
    mes: string;
    quantidade: number;
  }[];
}
