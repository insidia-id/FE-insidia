import { useMemo, useState } from 'react';
import { useGetMitras } from '../hooks/useMitras';
import { filterMitrasByVisibility } from '../lib/mitra.helper';
import type { MitraVisibilityFilter } from '../types/mitras.types';

export function useMitrasController({ enabled = true }: { enabled?: boolean }) {
  const [visibilityFilter, setVisibilityFilter] = useState<MitraVisibilityFilter>('available');
  const [selectedMitraId, setSelectedMitraId] = useState<string | undefined>();
  const [mitraQuery, setMitraQuery] = useState('');
  const { data: mitras = [], isLoading, isError, error } = useGetMitras(visibilityFilter, mitraQuery, { enabled });
  const mitraOptions = mitras.map((mitra) => ({
    label: mitra.name,
    value: mitra.id,
    meta: mitra,
  }));
  const visibleMitras = useMemo(() => filterMitrasByVisibility(mitras, visibilityFilter), [mitras, visibilityFilter]);

  return {
    visibilityFilter,
    visibleMitras,
    setSelectedMitraId,
    selectedMitraId,
    mitraOptions,
    setMitraQuery,
    isLoading,
    isError,
    error,
    onVisibilityFilterChange: setVisibilityFilter,
  };
}
