import { useMemo, useState } from 'react';
import { useGetMitras } from '../hooks/useMitras';
import { filterMitrasByVisibility } from '../lib/mitra.helper';
import type { MitraVisibilityFilter } from '../types/mitras.types';

export function MitrasController() {
  const [visibilityFilter, setVisibilityFilter] = useState<MitraVisibilityFilter>('available');
  const [mitraQuery, setMitraQuery] = useState('');
  const { data: mitras = [], isLoading, isError, error } = useGetMitras(visibilityFilter);

  const mitraOptions = mitras.map((mitra) => ({
    label: mitra.name,
    value: mitra.id,
    meta: mitra,
  }));
  const visibleMitras = useMemo(() => filterMitrasByVisibility(mitras, visibilityFilter), [mitras, visibilityFilter]);

  return {
    visibilityFilter,
    visibleMitras,
    mitraOptions,
    setMitraQuery,
    isLoading,
    isError,
    error,
    onVisibilityFilterChange: setVisibilityFilter,
  };
}
