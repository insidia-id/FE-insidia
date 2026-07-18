import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateUser } from './useUser';
import { CreateUserInput, createUserSchema } from '../schema/user.schema';
import { createProfileByRole, getUsersHref, normalizeRoleQueryParam, normalizeUserRolePayload, toUserMitraAssignments } from '../HelperUser';
import { useRouter } from 'next/navigation';
import { AccessScope } from '../../access-control/types/access-control.types';
function getDefaultValues(contextMitraId?: string, contextMitraName?: string, defaultRoleCode?: string): CreateUserInput {
  const normalizedRoleCode = normalizeRoleQueryParam(defaultRoleCode);

  const normalizedRole = normalizedRoleCode ? normalizeUserRolePayload(normalizedRoleCode) : null;

  const isMitraUser = Boolean(normalizedRole?.mitraRole || contextMitraId || normalizedRole?.scope === 'MITRA');

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
export type CreateUserControllerProps = {
  contextMitraId?: string;
  contextMitraName?: string;
  defaultRoleCode?: string;
  activeMitraSlug?: string;
  defaultScope?: AccessScope | undefined;
};

export const useCreateUserController = ({ contextMitraId, contextMitraName, defaultRoleCode, activeMitraSlug, defaultScope }: CreateUserControllerProps) => {
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: getDefaultValues(contextMitraId, contextMitraName, defaultRoleCode),
  });
  const createUserMutation = useCreateUser();
  const isSubmitting = createUserMutation.isPending;
  const router = useRouter();
  const onSubmit = (data: CreateUserInput) => {
    if (contextMitraId && !data.mitraRoles) {
      form.setError('mitraRoles', {
        type: 'manual',
        message: 'Role mitra wajib dipilih',
      });
      return;
    }

    createUserMutation.mutate(data, {
      onSuccess: (createdUser) => {
        router.push(getUsersHref(activeMitraSlug ?? '', `users/${createdUser.id}?scope=${defaultScope ?? data.scope}`));
      },
    });
  };
  return {
    form,
    onSubmit,
    isSubmitting,
  };
};
