'use client';

import { Controller } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { LoadingButton } from '@/components/common/ButtonLoading';
import { ConfirmDeleteDialog } from '@/components/dialog/DialogDelete';
import { readErrorMessage } from '@/lib/form/form.helper';
import { CourseModulesController } from '../controller/CourseModulesController';

type CourseModulesSectionProps = {
  courseId: string;
};

export function CourseModulesSection({ courseId }: CourseModulesSectionProps) {
  const { modules, form, editingModule, moduleToDelete, isLoading, isError, error, isFormOpen, isSubmitting, isDeleting, onCreate, onEdit, onSubmit, onDelete, onDeleteTargetChange, onFormOpenChange } = CourseModulesController(courseId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Modul Course</CardTitle>
          <CardDescription>{modules.length} modul terdaftar untuk course ini.</CardDescription>
        </div>
        <Button variant="insidia" onClick={onCreate}>
          Tambah Modul
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat modul...</p>
        ) : isError ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error instanceof Error ? error.message : 'Gagal memuat modul course.'}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Urutan</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Ringkasan</TableHead>
                  <TableHead>Konten</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                      Belum ada modul untuk course ini.
                    </TableCell>
                  </TableRow>
                ) : (
                  modules.map((module) => (
                    <TableRow key={module.id}>
                      <TableCell>{module.sortOrder}</TableCell>
                      <TableCell className="font-medium">{module.title}</TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{module.summary ?? '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{module._count.lessons} lesson</Badge>
                        <Badge variant="outline" className="ml-2">
                          {module._count.media} media
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => onEdit(module)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => onDeleteTargetChange(module)}>
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
        )}
      </CardContent>

      <Dialog open={isFormOpen} onOpenChange={onFormOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingModule ? 'Edit Modul' : 'Tambah Modul'}</DialogTitle>
            <DialogDescription>Atur judul, ringkasan, dan urutan modul agar struktur course tetap rapi.</DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Judul Modul</label>
              <Input {...form.register('title')} />
              {readErrorMessage(form.formState.errors, 'title') && <p className="text-sm text-destructive">{readErrorMessage(form.formState.errors, 'title')}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ringkasan</label>
              <Textarea value={form.watch('summary') ?? ''} {...form.register('summary')} />
              {readErrorMessage(form.formState.errors, 'summary') && <p className="text-sm text-destructive">{readErrorMessage(form.formState.errors, 'summary')}</p>}
            </div>

            <Controller
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Urutan</label>
                  <Input type="number" min={0} {...field} />
                  {readErrorMessage(form.formState.errors, 'sortOrder') && <p className="text-sm text-destructive">{readErrorMessage(form.formState.errors, 'sortOrder')}</p>}
                </div>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onFormOpenChange(false)} disabled={isSubmitting}>
                Batal
              </Button>
              <LoadingButton type="submit" variant="insidia" isLoading={isSubmitting}>
                {editingModule ? 'Perbarui Modul' : 'Simpan Modul'}
              </LoadingButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={Boolean(moduleToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            onDeleteTargetChange(null);
          }
        }}
        description={`Modul "${moduleToDelete?.title ?? ''}" akan dihapus dari course ini.`}
        isLoading={isDeleting}
        onConfirm={onDelete}
      />
    </Card>
  );
}
