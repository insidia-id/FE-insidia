import { useEffect } from 'react';
import { type Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetMitraById, useUpdateMitra } from './useMitras';
import { BaseMitraSchema, type UpdateMitraInput } from '../schema/mitra.schema';
import type { Mitra } from '../types/mitras.types';

const defaultValues: UpdateMitraInput = {
  name: '',
  type: 'SEKOLAH',
  status: 'ACTIVE',
  mitraProfile: {
    npsn: '',
    address: '',
  },
};

function toUpdateMitraFormValues(mitra: Mitra): UpdateMitraInput {
  return {
    name: mitra.name,
    type: mitra.type,
    status: mitra.status,
    mitraProfile: {
      npsn: mitra.mitraProfile?.npsn ?? '',
      address: mitra.mitraProfile?.address ?? '',
    },
  };
}

export function useUpdateMitraController(mitraId: string) {
  const form = useForm<UpdateMitraInput>({
    resolver: zodResolver(BaseMitraSchema) as Resolver<UpdateMitraInput>,
    defaultValues: defaultValues,
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
    const payload = values;

    updateMitraMutation.mutate(
      {
        mitraId,
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
