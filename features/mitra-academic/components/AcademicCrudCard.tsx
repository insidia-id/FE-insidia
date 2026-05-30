'use client';

import { Controller, type FieldValues, type Path, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { LoadingButton } from '@/components/common/ButtonLoading';
import { ConfirmDeleteDialog } from '@/components/dialog/DialogDelete';
import { readErrorMessage } from '@/lib/form/form.helper';
import { useAcademicCrudController } from '../controller/AcademicCrudController';
import type { AcademicColumn, AcademicFieldConfig } from '../types/mitra-academic.types';

type AcademicCrudCardProps<TItem, TFormValues extends FieldValues> = {
  title: string;
  description: string;
  items: TItem[];
  schema: z.ZodType<TFormValues>;
  defaultValues: TFormValues;
  fields: AcademicFieldConfig<TFormValues>[];
  columns: AcademicColumn<TItem>[];
  getItemId: (item: TItem) => string;
  getItemLabel: (item: TItem) => string;
  toFormValues: (item: TItem | null) => TFormValues;
  mutations: {
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
  };
};

export function AcademicCrudCard<TItem, TFormValues extends FieldValues>({
  title,
  description,
  items,
  schema,
  defaultValues,
  fields,
  columns,
  getItemId,
  getItemLabel,
  toFormValues,
  mutations,
}: AcademicCrudCardProps<TItem, TFormValues>) {
  const { form, editingItem, itemToDelete, isFormOpen, isSubmitting, isDeleting, onCreate, onEdit, onSubmit, onDelete, onFormOpenChange, onDeleteTargetChange } = useAcademicCrudController({
    schema,
    defaultValues,
    toFormValues,
    createMutation: mutations.createMutation,
    updateMutation: mutations.updateMutation,
    deleteMutation: mutations.deleteMutation,
    getItemId,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button variant="insidia" onClick={onCreate}>
          Tambah
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.header}>{column.header}</TableHead>
                ))}
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="py-8 text-center text-sm text-muted-foreground">
                    Belum ada data {title.toLowerCase()}.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={getItemId(item)}>
                    {columns.map((column) => (
                      <TableCell key={`${getItemId(item)}-${column.header}`}>{column.render(item)}</TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onDeleteTargetChange(item)}>
                          Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={isFormOpen} onOpenChange={onFormOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? `Edit ${title}` : `Tambah ${title}`}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {fields.map((field) => (
              <FieldRenderer key={field.name} field={field} form={form} />
            ))}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onFormOpenChange(false)} disabled={isSubmitting}>
                Batal
              </Button>
              <LoadingButton type="submit" variant="insidia" isLoading={isSubmitting}>
                {editingItem ? 'Perbarui' : 'Simpan'}
              </LoadingButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            onDeleteTargetChange(null);
          }
        }}
        description={`${itemToDelete ? getItemLabel(itemToDelete) : 'Data'} akan dihapus dari modul akademik mitra.`}
        isLoading={isDeleting}
        onConfirm={onDelete}
      />
    </Card>
  );
}

function FieldRenderer<TFormValues extends FieldValues>({ field, form }: { field: AcademicFieldConfig<TFormValues>; form: UseFormReturn<TFormValues, unknown, TFormValues>; }) {
  const fieldName = field.name as Path<TFormValues>;
  const error = readErrorMessage(form.formState.errors, field.name);

  if (field.type === 'textarea') {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">{field.label}</label>
        <Textarea value={String(form.watch(fieldName) ?? '')} {...form.register(fieldName)} placeholder={field.placeholder} />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  if (field.type === 'select') {
    return (
        <Controller
          control={form.control}
          name={fieldName}
        render={({ field: controllerField }) => (
          <div className="space-y-2">
            <label className="text-sm font-medium">{field.label}</label>
            <Select value={controllerField.value ? String(controllerField.value) : undefined} onValueChange={controllerField.onChange}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder ?? `Pilih ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}
      />
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{field.label}</label>
      <Input type={field.type === 'date' ? 'date' : 'text'} value={String(form.watch(fieldName) ?? '')} {...form.register(fieldName)} placeholder={field.placeholder} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
