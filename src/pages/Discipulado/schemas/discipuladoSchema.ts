
import * as z from 'zod';

export const discipuladoFormSchema = z.object({
  discipulador_id: z.string({
    required_error: 'Selecione um discipulador'
  }),
  discipulo_id: z.string({
    required_error: 'Selecione um discípulo'
  }),
}).refine(data => data.discipulador_id !== data.discipulo_id, {
  message: "Discipulador e discípulo não podem ser a mesma pessoa",
  path: ["discipulo_id"]
});

export type DiscipuladoFormValues = z.infer<typeof discipuladoFormSchema>;
