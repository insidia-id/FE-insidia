import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateUser } from '../hooks/useUser';
import { CreateUserInput, createUserSchema } from '../schema/user.schema';
import { normalizeUserRolePayload } from '../HelperUser';

function getDefaultValues(contextMitraId?: string): CreateUserInput {
  return {
    email: '',
    name: '',
    phone: '',
    role: 'USER',
    mitraRole: undefined,
    scope: contextMitraId ? 'MITRA' : 'INSIDIA',
    status: 'ACTIVE',
    mitraId: contextMitraId,
  };
}

export const CreateUserController = (contextMitraId?: string) => {
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: getDefaultValues(contextMitraId),
  });
  const createUserMutation = useCreateUser();
  const isSubmitting = createUserMutation.isPending;

  const onSubmit = (data: CreateUserInput) => {
    if (contextMitraId && !data.mitraRole) {
      form.setError('mitraRole', {
        type: 'manual',
        message: 'Role mitra wajib dipilih',
      });
      return;
    }

    const selectedRole = data.mitraRole ?? data.role;
    const normalized = normalizeUserRolePayload(selectedRole);
    const isMitraUser = Boolean(contextMitraId || normalized.mitraRole || data.scope === 'MITRA');

    const resolvedMitraId = isMitraUser ? (contextMitraId ?? data.mitraId) : undefined;
    const resolvedScope = isMitraUser ? 'MITRA' : 'INSIDIA';

    createUserMutation.mutate({
      ...data,
      role: isMitraUser ? 'USER' : normalized.insidiaRole,
      mitraRole: isMitraUser ? (normalized.mitraRole ?? data.mitraRole) : undefined,
      mitraId: resolvedMitraId,
      scope: resolvedScope,
    });
  };
  return {
    form,
    onSubmit,
    isSubmitting,
  };
};
