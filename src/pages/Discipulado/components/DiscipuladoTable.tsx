
import { Button } from '@/components/ui/button';
import { CalendarPlus, Eye, Trash2 } from 'lucide-react';
import { Discipulado } from '../hooks/useDiscipuladoData';
import { formatDate } from '@/lib/utils';

interface DiscipuladoTableProps {
  discipulados: Discipulado[];
  loading: boolean;
  handleAddEncontro: (discipulado: Discipulado) => void;
  handleViewHistorico: (discipulado: Discipulado) => void;
  handleDeleteDiscipulado: (discipulado: Discipulado) => void;
  isLeaderOrAdmin: boolean;
}

export function DiscipuladoTable({
  discipulados,
  loading,
  handleAddEncontro,
  handleViewHistorico,
  handleDeleteDiscipulado,
  isLeaderOrAdmin
}: DiscipuladoTableProps) {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-10 px-4 text-left">Discipulador</th>
              <th className="h-10 px-4 text-left">Discípulo</th>
              <th className="h-10 px-4 text-left">Data de Criação</th>
              <th className="h-10 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="h-12 px-4 text-center">
                  Carregando discipulados...
                </td>
              </tr>
            ) : discipulados.length === 0 ? (
              <tr>
                <td colSpan={4} className="h-12 px-4 text-center">
                  Nenhum discipulado encontrado.
                </td>
              </tr>
            ) : (
              discipulados.map((discipulado) => (
                <tr key={discipulado.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle">
                    {discipulado.discipulador?.nome || 'Não definido'}
                  </td>
                  <td className="p-4 align-middle">
                    {discipulado.discipulo?.nome || 'Não definido'}
                  </td>
                  <td className="p-4 align-middle">
                    {formatDate(discipulado.criado_em)}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      {isLeaderOrAdmin && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddEncontro(discipulado)}
                          title="Adicionar encontro"
                        >
                          <CalendarPlus className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewHistorico(discipulado)}
                        title="Ver histórico de encontros"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {isLeaderOrAdmin && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDiscipulado(discipulado)}
                          className="text-destructive hover:bg-destructive/10"
                          title="Excluir discipulado"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
