import { useQuery } from '@tanstack/react-query';

import { mitraAcademicKeys } from '../../shared/hooks/query-keys';
import { useCrudMutations } from '../../shared/hooks/useCrudMutations';
import { createAcademicYear, deleteAcademicYear, getAcademicYears, updateAcademicYear } from '../api/academic-year.api';
import type { AcademicYearFormValues } from '../schema/academic-year.schema';

const RESOURCE_KEY = 'academic-years';

export function useAcademicYears() {
  return useQuery({
    queryKey: mitraAcademicKeys.resource(RESOURCE_KEY),
    queryFn: () => getAcademicYears(),
    refetchOnWindowFocus: false,
  });
}

export function useAcademicYearMutations() {
  return useCrudMutations<AcademicYearFormValues>({
    resourceKey: RESOURCE_KEY,
    createFn: createAcademicYear,
    updateFn: updateAcademicYear,
    deleteFn: deleteAcademicYear,
    successLabel: 'Tahun Ajaran',
  });
}
