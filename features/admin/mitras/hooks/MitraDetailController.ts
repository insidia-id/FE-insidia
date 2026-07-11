import { useState } from 'react';
import { useGetMitraById } from './useMitras';

export function useMitraDetailController(mitraId: string) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { data: mitra, isLoading, isError, error } = useGetMitraById(mitraId);

  return {
    mitra,
    isLoading,
    isError,
    error,
    isDeleteOpen,
    onDeleteDialogChange: setIsDeleteOpen,
  };
}
