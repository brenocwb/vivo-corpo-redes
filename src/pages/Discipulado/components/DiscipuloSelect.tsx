
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { User } from '../hooks/useUsersList';
import { DiscipuladoFormValues } from '../schemas/discipuladoSchema';

interface DiscipuloSelectProps {
  control: Control<DiscipuladoFormValues>;
  users: User[];
  loading: boolean;
}

export const DiscipuloSelect = ({ control, users, loading }: DiscipuloSelectProps) => {
  return (
    <FormField
      control={control}
      name="discipulo_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Discípulo</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um discípulo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {loading ? (
                <SelectItem value="loading" disabled>Carregando...</SelectItem>
              ) : users.length === 0 ? (
                <SelectItem value="none" disabled>Nenhum usuário encontrado</SelectItem>
              ) : (
                users.map(user => (
                  <SelectItem key={user.id} value={user.id}>{user.nome}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
