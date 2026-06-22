import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateUser } from '../hooks/useUser';
import { CreateUserInput, createUserSchema } from '../schema/user.schema';
import { normalizeRoleQueryParam, normalizeUserRolePayload, toUserMitraAssignments } from '../HelperUser';

function getDefaultValues(contextMitraId?: string, defaultRoleCode?: string): CreateUserInput {
  const normalizedRoleCode = normalizeRoleQueryParam(defaultRoleCode);
  const normalizedRole = normalizedRoleCode ? normalizeUserRolePayload(normalizedRoleCode) : null;
  const isMitraUser = Boolean(normalizedRole?.mitraRole || contextMitraId || normalizedRole?.scope === 'MITRA');
  const mitraAssignments = toUserMitraAssignments();

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

export const CreateUserController = (contextMitraId?: string, defaultRoleCode?: string) => {
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: getDefaultValues(contextMitraId, defaultRoleCode),
  });
  const createUserMutation = useCreateUser();
  const isSubmitting = createUserMutation.isPending;

  const onSubmit = (data: CreateUserInput) => {
    console.log('CreateUserController onSubmit data:', data);
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
