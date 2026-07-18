'use client';

import { Controller, UseFormReturn } from 'react-hook-form';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SelectField, TextAreaField, TextField } from '@/components/common/form';
import { readErrorMessage } from '@/lib/form/form.helper';
import { LessonEditor } from './LessonEditor';
import { LessonsSchema } from '../schema/lessons.schema';
import { formatDate } from '@/lib/helper/normalizer.helper';
type LessonCreateFormProps = {
  form: UseFormReturn<LessonsSchema>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
};

export function LessonCreateForm({ form, isSubmitting, onSubmit, onCancel }: LessonCreateFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-xl border bg-white p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField id="lesson-title" label="Title" placeholder="Masukkan judul Materi" error={readErrorMessage(form.formState.errors, 'title')} disabled={isSubmitting} {...form.register('title')} />

          <TextField id="lesson-slug" label="Nama URL (Slug)" placeholder="contoh: belajar-javascript-dasar" error={readErrorMessage(form.formState.errors, 'slug')} disabled={isSubmitting} {...form.register('slug')} />

          <div className="space-y-2">
            <Controller
              control={form.control}
              name="typeLesson"
              render={({ field }) => (
                <SelectField
                  label="Tipe Materi"
                  placeholder="Pilih tipe materi"
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: 'ARTICLE', label: 'Article' },
                    { value: 'VIDEO', label: 'Video' },
                  ]}
                />
              )}
            />

            {readErrorMessage(form.formState.errors, 'typeLesson') && <p className="text-sm text-destructive">{readErrorMessage(form.formState.errors, 'typeLesson')}</p>}
          </div>

          <TextField id="lesson-sort-order" label="Sort Order" type="number" placeholder="1" error={readErrorMessage(form.formState.errors, 'sortOrder')} disabled={isSubmitting} {...form.register('order', { valueAsNumber: true })} />

          <Controller
            control={form.control}
            name="availableFrom"
            render={({ field }) => <TextField label="Mulai Tersedia" id="availableFrom" type="datetime-local" onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)} />}
          />
          <Controller
            control={form.control}
            name="availableUntil"
            render={({ field }) => <TextField label="Berakhir Tersedia (kosongkan jika tidak terbatas)" id="availableUntil" type="datetime-local" onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)} />}
          />

          <div className="md:col-span-2">
            <TextAreaField id="lesson-description" label="Description" placeholder="Deskripsi materi" error={readErrorMessage(form.formState.errors, 'description')} disabled={isSubmitting} {...form.register('description')} />
          </div>

          <div className="flex items-center gap-6 md:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="size-4 rounded border-input" disabled={isSubmitting} {...form.register('isPreview')} />
              Preview Materi
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="size-4 rounded border-input" disabled={isSubmitting} {...form.register('published')} />
              Published
            </label>
          </div>
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Materi Content</Label>
        <LessonEditor
          initialContentJson={form.watch('contentJson')}
          initialContentHtml={form.watch('contentHtml')}
          showSaveButton={false}
          onChange={(content) => {
            form.setValue('contentJson', content.contentJson, { shouldDirty: true, shouldValidate: true });
            form.setValue('contentHtml', content.contentHtml, { shouldDirty: true, shouldValidate: true });
          }}
        />
      </div>

      <div className="sticky bottom-0 flex justify-between gap-3 rounded-xl border bg-white p-4 shadow-sm">
        <Button type="button" variant="outline" disabled={isSubmitting} onClick={onCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Buat Materi
        </Button>
      </div>
    </form>
  );
}
