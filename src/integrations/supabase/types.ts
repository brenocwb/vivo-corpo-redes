export type UserRole = 'admin' | 'lider' | 'membro'; // Ou os novos termos

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      discipulados: {
        Row: {
          criado_em: string | null
          discipulador_id: string | null
          discipulo_id: string | null
          id: string
        }
        Insert: {
          criado_em?: string | null
          discipulador_id?: string | null
          discipulo_id?: string | null
          id?: string
        }
        Update: {
          criado_em?: string | null
          discipulador_id?: string | null
          discipulo_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discipulados_discipulador_id_fkey"
            columns: ["discipulador_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discipulados_discipulo_id_fkey"
            columns: ["discipulo_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      encontros: {
        Row: {
          anotacoes: string | null
          criado_em: string | null
          data: string
          discipulado_id: string | null
          id: string
          tema: string | null
        }
        Insert: {
          anotacoes?: string | null
          criado_em?: string | null
          data: string
          discipulado_id?: string | null
          id?: string
          tema?: string | null
        }
        Update: {
          anotacoes?: string | null
          criado_em?: string | null
          data?: string
          discipulado_id?: string | null
          id?: string
          tema?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "encontros_discipulado_id_fkey"
            columns: ["discipulado_id"]
            isOneToOne: false
            referencedRelation: "discipulados"
            referencedColumns: ["id"]
          },
        ]
      }
      grupos: {
        Row: {
          criado_em: string | null
          dia_semana: string | null
          id: string
          lider_id: string | null
          local: string | null
          nome: string
        }
        Insert: {
          criado_em?: string | null
          dia_semana?: string | null
          id?: string
          lider_id?: string | null
          local?: string | null
          nome: string
        }
        Update: {
          criado_em?: string | null
          dia_semana?: string | null
          id?: string
          lider_id?: string | null
          local?: string | null
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_grupos_lider_id"
            columns: ["lider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lider"
            columns: ["lider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos_oracao: {
        Row: {
          criado_em: string | null
          id: string
          moderado: boolean | null
          pedido: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          criado_em?: string | null
          id?: string
          moderado?: boolean | null
          pedido: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          criado_em?: string | null
          id?: string
          moderado?: boolean | null
          pedido?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_oracao_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      planos: {
        Row: {
          criado_em: string | null
          descricao: string | null
          etapas: Json | null
          id: string
          nome: string
        }
        Insert: {
          criado_em?: string | null
          descricao?: string | null
          etapas?: Json | null
          id?: string
          nome: string
        }
        Update: {
          criado_em?: string | null
          descricao?: string | null
          etapas?: Json | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      progresso_planos: {
        Row: {
          atualizado_em: string | null
          etapas_concluidas: Json | null
          id: string
          plano_id: string | null
          user_id: string | null
        }
        Insert: {
          atualizado_em?: string | null
          etapas_concluidas?: Json | null
          id?: string
          plano_id?: string | null
          user_id?: string | null
        }
        Update: {
          atualizado_em?: string | null
          etapas_concluidas?: Json | null
          id?: string
          plano_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progresso_planos_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progresso_planos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      testemunhos: {
        Row: {
          criado_em: string | null
          id: string
          texto: string
          user_id: string | null
        }
        Insert: {
          criado_em?: string | null
          id?: string
          texto: string
          user_id?: string | null
        }
        Update: {
          criado_em?: string | null
          id?: string
          texto?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testemunhos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          criado_em: string | null
          email: string
          grupo_id: string | null
          id: string
          nome: string
          senha: string | null
          tipo_usuario: string
        }
        Insert: {
          criado_em?: string | null
          email: string
          grupo_id?: string | null
          id?: string
          nome: string
          senha?: string | null
          tipo_usuario: string
        }
        Update: {
          criado_em?: string | null
          email?: string
          grupo_id?: string | null
          id?: string
          nome?: string
          senha?: string | null
          tipo_usuario?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
