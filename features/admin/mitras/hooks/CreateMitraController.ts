import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateMitra } from './useMitras';
import { BaseMitraSchema, type CreateMitraInput } from '../schema/mitra.schema';

const defaultValues: CreateMitraInput = {
  name: '',
  type: 'SEKOLAH',
  status: 'ACTIVE',
  mitraProfile: {
    npsn: '',
    address: '',
  },
};

export function useCreateMitraController() {
  const form = useForm<CreateMitraInput>({
    resolver: zodResolver(BaseMitraSchema),
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
