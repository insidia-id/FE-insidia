import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateUser } from '../hooks/useUser';
import { CreateUserInput, createUserSchema } from '../schema/user.schema';

const defaultValues: CreateUserInput = {
  email: '',
  name: '',
  phone: '',
  role: 'USER_BIASA',
  status: 'ACTIVE',
};

export const CreateUserController = () => {
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues,
  });
  const createUserMutation = useCreateUser();
  const isSubmitting = createUserMutation.isPending;

  const onSubmit = (data: CreateUserInput) => {
    createUserMutation.mutate(data, {
      onSuccess: () => {
        form.reset(defaultValues);
      },
    });
  };
  return {
    form,
    onSubmit,
    isSubmitting,
  };
};
