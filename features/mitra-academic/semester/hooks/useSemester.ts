import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetSemesters, useSemesterMutations } from './useQuerySemester';
import { semesterFormSchema, SemesterFormValues } from '../schema/semester.schema';
import { Semester } from '../types/semester.types';

export function useSemester(mitraId: string) {
  const query = useGetSemesters(mitraId);
  const mutations = useSemesterMutations(mitraId);
  const { createMutation, updateMutation, deleteMutation } = mutations;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Semester | null>(null);
  const [deletingItem, setDeletingItem] = useState<Semester | null>(null);

  const form = useForm<SemesterFormValues>({
    resolver: zodResolver(semesterFormSchema),
    defaultValues: {
      academicYearId: '',
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

  const handleSubmit = form.handleSubmit((data: SemesterFormValues) => {
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
      semesters: query.data ?? [],
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
