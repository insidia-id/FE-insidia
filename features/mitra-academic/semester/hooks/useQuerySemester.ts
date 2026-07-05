import { useQuery } from '@tanstack/react-query';

import { mitraAcademicKeys } from '../../shared/hooks/query-keys';
import { useCrudMutations } from '../../shared/hooks/useCrudMutations';
import { createSemester, deleteSemester, getSemesters, updateSemester } from '../api/semester.api';
import type { SemesterFormValues } from '../schema/semester.schema';

const RESOURCE_KEY = 'semesters';

export function useGetSemesters(mitraId: string) {
  return useQuery({
    queryKey: mitraAcademicKeys.resource(RESOURCE_KEY),
    queryFn: () => getSemesters(mitraId),
    refetchOnWindowFocus: false,
  });
}

export function useSemesterMutations(mitraId: string) {
  return useCrudMutations<SemesterFormValues>({
    resourceKey: RESOURCE_KEY,
    createFn: (data) => createSemester(mitraId, data),
    updateFn: (id, data) => updateSemester(mitraId, id, data),
    deleteFn: (id) => deleteSemester(mitraId, id),
    successLabel: 'Semester',
  });
}
