import { useQuery } from '@tanstack/react-query';

import { mitraAcademicKeys } from '../../shared/hooks/query-keys';
import { useCrudMutations } from '../../shared/hooks/useCrudMutations';
import { createSemester, deleteSemester, getSemesters, updateSemester } from '../api/semester.api';
import type { SemesterFormValues } from '../schema/semester.schema';

const RESOURCE_KEY = 'semesters';

export function useGetSemesters() {
  return useQuery({
    queryKey: mitraAcademicKeys.resource(RESOURCE_KEY),
    queryFn: () => getSemesters(),
    refetchOnWindowFocus: false,
  });
}

export function useSemesterMutations() {
  return useCrudMutations<SemesterFormValues>({
    resourceKey: RESOURCE_KEY,
    createFn: createSemester,
    updateFn: updateSemester,
    deleteFn: deleteSemester,
    successLabel: 'Semester',
  });
}
