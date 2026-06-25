import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateUser } from './useUser';
import { CreateUserInput, createUserSchema } from '../schema/user.schema';
import { createProfileByRole, normalizeRoleQueryParam, normalizeUserRolePayload, toUserMitraAssignments } from '../HelperUser';

function getDefaultValues(contextMitraId?: string, contextMitraName?: string, defaultRoleCode?: string): CreateUserInput {
  const normalizedRoleCode = normalizeRoleQueryParam(defaultRoleCode);

  const normalizedRole = normalizedRoleCode ? normalizeUserRolePayload(normalizedRoleCode) : null;

  const isMitraUser = Boolean(normalizedRole?.mitraRole || contextMitraId || normalizedRole?.scope === 'MITRA');

  console.log(`getDefaultValues - contextMitraId: ${contextMitraId}, contextMitraName: ${contextMitraName}, defaultRoleCode: ${defaultRoleCode}, normalizedRoleCode: ${normalizedRoleCode}, isMitraUser: ${isMitraUser}`);

  let mitraAssignments: CreateUserInput['mitraRoles'] = [];

  if (contextMitraId) {
    const roleCode = normalizedRole?.mitraRole ?? 'AKADEMIK';

    mitraAssignments = [
      {
        mitraId: contextMitraId,
        mitraName: contextMitraName ?? '',
        mitraSlug: '',
        roleCode,
        profile: createProfileByRole(roleCode),
      },
    ];
  }

  return {
    email: '',
    name: '',
    phone: '',
    role: isMitraUser ? 'USER' : (normalizedRole?.insidiaRole ?? 'USER'),
    mitraRoles: mitraAssignments,
    scope: isMitraUser ? 'MITRA' : 'INSIDIA',
    status: 'ACTIVE',
  };
}

export const useCreateUserController = (contextMitraId?: string, contextMitraName?: string, defaultRoleCode?: string) => {
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: getDefaultValues(contextMitraId, contextMitraName, defaultRoleCode),
  });
  const createUserMutation = useCreateUser();
  const isSubmitting = createUserMutation.isPending;

  const onSubmit = (data: CreateUserInput) => {
    if (contextMitraId && !data.mitraRoles) {
      form.setError('mitraRoles', {
        type: 'manual',
        message: 'Role mitra wajib dipilih',
      });
      return;
    }

    createUserMutation.mutate(data);
  };
  return {
    form,
    onSubmit,
    isSubmitting,
  };
};
