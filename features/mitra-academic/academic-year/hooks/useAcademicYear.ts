import { useQuery } from '@tanstack/react-query';

import { mitraAcademicKeys } from '../../shared/hooks/query-keys';
import { useCrudMutations } from '../../shared/hooks/useCrudMutations';
import { createAcademicYear, deleteAcademicYear, getAcademicYears, updateAcademicYear } from '../api/academic-year.api';
import type { AcademicYearFormValues } from '../schema/academic-year.schema';

const RESOURCE_KEY = 'academic-years';

export function useAcademicYears(mitraId: string) {
  return useQuery({
    queryKey: mitraAcademicKeys.resource(RESOURCE_KEY),
    queryFn: () => getAcademicYears(mitraId),
    refetchOnWindowFocus: false,
  });
}

export function useAcademicYearMutations(mitraId: string) {
  return useCrudMutations<AcademicYearFormValues>({
    resourceKey: RESOURCE_KEY,
    createFn: (data) => createAcademicYear(mitraId, data),
    updateFn: (id, data) => updateAcademicYear(mitraId, id, data),
    deleteFn: (id) => deleteAcademicYear(mitraId, id),
    successLabel: 'Tahun Ajaran',
  });
}
