import { useEffect, useState } from 'react';
import { useForm, type DefaultValues, type FieldValues, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type CrudControllerOptions<TItem, TFormValues extends FieldValues> = {
  schema: unknown;
  defaultValues: TFormValues;
  toFormValues: (item: TItem | null) => TFormValues;
  createMutation: {
    mutate: (data: TFormValues, options?: { onSuccess?: () => void }) => void;
    isPending: boolean;
  };
  updateMutation: {
    mutate: (payload: { id: string; data: TFormValues }, options?: { onSuccess?: () => void }) => void;
    isPending: boolean;
  };
  deleteMutation: {
    mutate: (id: string, options?: { onSuccess?: () => void }) => void;
    isPending: boolean;
  };
  getItemId: (item: TItem) => string;
};

export function useAcademicCrudController<TItem, TFormValues extends FieldValues>({
  schema,
  defaultValues,
  toFormValues,
  createMutation,
  updateMutation,
  deleteMutation,
  getItemId,
}: CrudControllerOptions<TItem, TFormValues>) {
  const [editingItem, setEditingItem] = useState<TItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<TItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<TFormValues, unknown, TFormValues>({
    resolver: zodResolver(schema as never) as Resolver<TFormValues>,
    defaultValues: defaultValues as DefaultValues<TFormValues>,
  });

  useEffect(() => {
    form.reset(toFormValues(editingItem));
  }, [editingItem, form, toFormValues]);

  const onCreate = () => {
    setEditingItem(null);
    form.reset(defaultValues);
    setIsFormOpen(true);
  };

  const onEdit = (item: TItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const onSubmit = (data: TFormValues) => {
    if (editingItem) {
      updateMutation.mutate(
        {
          id: getItemId(editingItem),
          data,
        },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingItem(null);
          },
        },
      );

      return;
    }

    createMutation.mutate(data, {
      onSuccess: () => {
        setIsFormOpen(false);
        form.reset(defaultValues);
      },
    });
  };

  const onDelete = () => {
    if (!itemToDelete) {
      return;
    }

    deleteMutation.mutate(getItemId(itemToDelete), {
      onSuccess: () => {
        setItemToDelete(null);
      },
    });
  };

  return {
    form,
    editingItem,
    itemToDelete,
    isFormOpen,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    onCreate,
    onEdit,
    onSubmit,
    onDelete,
    onFormOpenChange: setIsFormOpen,
    onDeleteTargetChange: setItemToDelete,
  };
}
