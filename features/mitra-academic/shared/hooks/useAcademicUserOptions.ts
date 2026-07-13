import { useMemo } from 'react';
import { getUserRole } from '@/features/admin/user/HelperUser';
import { useGetUsers } from '@/features/admin/user/hooks/useUser';
import type { SelectOption } from '../types/common.types';

export function useAcademicUserOptions() {
  const usersQuery = useGetUsers({ filter: 'available', scope: 'MITRA', page: 1, limit: 10 });
  const teacherOptions = useMemo<SelectOption[]>(
    () =>
      (usersQuery.data?.users ?? [])
        .filter((user) => getUserRole(user, 'MITRA') === 'GURU')
        .map((user) => ({
          label: user.name ?? user.email,
          value: user.id,
        })),
    [usersQuery.data?.users],
  );
  const studentOptions = useMemo<SelectOption[]>(
    () =>
      (usersQuery.data?.users ?? [])
        .filter((user) => getUserRole(user, 'MITRA') === 'MURID')
        .map((user) => ({
          label: user.name ?? user.email,
          value: user.id,
        })),
    [usersQuery.data?.users],
  );

  return {
    teacherOptions,
    studentOptions,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
  };
}
