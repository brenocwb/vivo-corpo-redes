
import { useState } from 'react';
import { Discipulado } from './useDiscipuladoData';

export const useDiscipuladoDialogs = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [encontroDialogOpen, setEncontroDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [historicoDialogOpen, setHistoricoDialogOpen] = useState(false);
  const [selectedDiscipulado, setSelectedDiscipulado] = useState<Discipulado | null>(null);

  const handleCreateDiscipulado = () => {
    setSelectedDiscipulado(null);
    setCreateDialogOpen(true);
  };

  const handleDeleteDiscipulado = (discipulado: Discipulado) => {
    setSelectedDiscipulado(discipulado);
    setDeleteDialogOpen(true);
  };

  const handleAddEncontro = (discipulado: Discipulado) => {
    setSelectedDiscipulado(discipulado);
    setEncontroDialogOpen(true);
  };

  const handleViewHistorico = (discipulado: Discipulado) => {
    setSelectedDiscipulado(discipulado);
    setHistoricoDialogOpen(true);
  };

  return {
    createDialogOpen,
    setCreateDialogOpen,
    encontroDialogOpen,
    setEncontroDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    historicoDialogOpen,
    setHistoricoDialogOpen,
    selectedDiscipulado,
    setSelectedDiscipulado,
    handleCreateDiscipulado,
    handleDeleteDiscipulado,
    handleAddEncontro,
    handleViewHistorico,
  };
};
