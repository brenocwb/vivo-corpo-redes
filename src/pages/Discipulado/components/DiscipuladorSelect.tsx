
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { User } from '../hooks/useUsersList';
import { DiscipuladoFormValues } from '../schemas/discipuladoSchema';
import { useAuth } from '@/context/AuthContext';

interface DiscipuladorSelectProps {
  control: Control<DiscipuladoFormValues>;
  users: User[];
  loading: boolean;
}

export const DiscipuladorSelect = ({ control, users, loading }: DiscipuladorSelectProps) => {
  const { user, isAdmin } = useAuth();
  
  return (
    <FormField
      control={control}
      name="discipulador_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Discipulador</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            value={field.value}
            disabled={!isAdmin() && user?.id === field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um discipulador" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {loading ? (
                <SelectItem value="loading" disabled>Carregando...</SelectItem>
              ) : users.length === 0 ? (
                <SelectItem value="none" disabled>Nenhum usuário encontrado</SelectItem>
              ) : (
                // Filtrando para mostrar apenas admin e discipuladores como discipuladores
                users
                  .filter(user => ['admin', 'lider', 'discipulador'].includes(user.tipo_usuario || ''))
                  .map(user => (
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
