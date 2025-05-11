
import * as z from 'zod';

export const planoSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório.'),
  descricao: z.string().min(1, 'A descrição é obrigatória.'),
  etapas: z.array(
    z.object({
      titulo: z.string().min(1, 'O título da etapa é obrigatório.'),
      descricao: z.string().optional(),
      ordem: z.number(),
      recursos: z.array(z.string()).optional(),
    })
  ).min(1, 'O plano deve ter pelo menos uma etapa.'),
});

export type PlanoFormValues = z.infer<typeof planoSchema>;

export const etapaSchema = z.object({
  titulo: z.string().min(1, 'O título da etapa é obrigatório.'),
  descricao: z.string().optional(),
  recursos: z.array(z.string()).optional(),
});

export type EtapaFormValues = z.infer<typeof etapaSchema>;
