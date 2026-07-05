import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAcademicYears, useAcademicYearMutations } from './useAcademicYear';
import { academicYearFormSchema, type AcademicYearFormValues } from '../schema/academic-year.schema';
import { AcademicYear } from '../types/academic-year.types';

export function useAcademicYearController(mitraId: string) {
  const query = useAcademicYears(mitraId);
  const mutations = useAcademicYearMutations(mitraId);
  const { createMutation, updateMutation, deleteMutation } = mutations;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AcademicYear | null>(null);
  const [deletingItem, setDeletingItem] = useState<AcademicYear | null>(null);

  const form = useForm<AcademicYearFormValues>({
    resolver: zodResolver(academicYearFormSchema),
    defaultValues: {
      name: '',
      startDate: '',
      endDate: '',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (!form.formState.isSubmitting) {
      form.reset();
    }
  }, [form.formState.isSubmitting]);

  const isSubmitting = mutations.createMutation.isPending || mutations.updateMutation.isPending;

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    form.reset();
  };

  const handleSubmit = form.handleSubmit((data: AcademicYearFormValues) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data },
        {
          onSuccess: () => {
            handleCloseForm();
          },
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          handleCloseForm();
        },
      });
    }
  });

  const handleDelete = () => {
    if (deletingItem) {
      deleteMutation.mutate(deletingItem.id, {
        onSuccess: () => {
          setDeletingItem(null);
        },
      });
    }
  };
  return {
    form,

    Mutations: {
      createMutation: mutations.createMutation,
      updateMutation: mutations.updateMutation,
      deleteMutation: mutations.deleteMutation,
    },

    queries: {
      academicYears: query.data ?? [],
      isLoading: query.isLoading,
      isError: query.isError,
      isSubmitting,
    },

    state: {
      isFormOpen,
      editingItem,
      deletingItem,
      setIsFormOpen,
      setEditingItem,
      setDeletingItem,
    },

    actions: {
      handleCreate,
      handleCloseForm,
      handleSubmit,
      handleDelete,
    },
  };
}
