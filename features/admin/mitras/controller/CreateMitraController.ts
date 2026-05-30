import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateMitra } from '../hooks/useMitras';
import { createMitraSchema, type CreateMitraInput } from '../schema/mitra.schema';

const defaultValues: CreateMitraInput = {
  name: '',
  type: 'SEKOLAH',
  status: 'ACTIVE',
};

export function CreateMitraController() {
  const form = useForm<CreateMitraInput>({
    resolver: zodResolver(createMitraSchema),
    defaultValues,
  });
  const createMitraMutation = useCreateMitra();

  const onSubmit = (data: CreateMitraInput, onSuccess?: (mitraId: string) => void) => {
    createMitraMutation.mutate(data, {
      onSuccess: (mitra) => {
        form.reset(defaultValues);
        onSuccess?.(mitra.id);
      },
    });
  };

  return {
    form,
    isSubmitting: createMitraMutation.isPending,
    onSubmit,
  };
}
