import { useEffect } from 'react';
import { type Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetMitraById, useUpdateMitra } from '../hooks/useMitras';
import { updateMitraSchema, type UpdateMitraInput } from '../schema/mitra.schema';
import type { Mitra } from '../types/mitras.types';

const defaultValues: UpdateMitraInput = {
  id: '',
  name: '',
  type: 'SEKOLAH',
  status: 'ACTIVE',
};

function toUpdateMitraFormValues(mitra: Mitra): UpdateMitraInput {
  return {
    id: mitra.id,
    name: mitra.name,
    type: mitra.type,
    status: mitra.status,
  };
}

export function UpdateMitraController(mitraId: string) {
  const form = useForm<UpdateMitraInput>({
    resolver: zodResolver(updateMitraSchema) as Resolver<UpdateMitraInput>,
    defaultValues: {
      ...defaultValues,
      id: mitraId,
    },
  });

  const { data: mitra, isLoading, isError, error } = useGetMitraById(mitraId);
  const updateMitraMutation = useUpdateMitra();

  useEffect(() => {
    if (!mitra) {
      return;
    }

    form.reset(toUpdateMitraFormValues(mitra));
  }, [form, mitra]);

  const onSubmit = (values: UpdateMitraInput, onSuccess?: (updatedMitraId: string) => void) => {
    const { id, ...payload } = values;

    updateMitraMutation.mutate(
      {
        mitraId: id,
        data: payload,
      },
      {
        onSuccess: (updatedMitra) => {
          form.reset(toUpdateMitraFormValues(updatedMitra));
          onSuccess?.(updatedMitra.id);
        },
      },
    );
  };

  return {
    form,
    mitra,
    isLoading,
    isError,
    error,
    isSubmitting: updateMitraMutation.isPending,
    onSubmit,
  };
}
