'use client';

import { Controller } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
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
import { bytesToSize, MEDIA_TYPE_OPTIONS } from '../lib/course.helper';
import { CourseMediaController } from '../controller/CourseMediaController';

type CourseMediaSectionProps = {
  courseId: string;
};

export function CourseMediaSection({ courseId }: CourseMediaSectionProps) {
  const { modules, groupedMedia, uploadForm, metadataForm, uploadTarget, selectedModuleId, mediaToDelete, isLoading, isError, error, isMetadataOpen, isUploading, isUpdating, isDeleting, onUploadSubmit, onEdit, onDelete, onUploadTargetChange, onSelectedModuleChange, onMetadataSubmit, onMetadataOpenChange, onDeleteTargetChange } = CourseMediaController(courseId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Course</CardTitle>
        <CardDescription>Unggah media ke level course atau modul sesuai kebutuhan penyajian materi.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="grid gap-4 rounded-lg border p-4 md:grid-cols-2 xl:grid-cols-6" onSubmit={uploadForm.handleSubmit(onUploadSubmit)}>
          <div className="space-y-2 xl:col-span-2">
            <label className="text-sm font-medium">File Media</label>
            <Input type="file" onChange={(event) => uploadForm.setValue('file', event.target.files?.[0] as File, { shouldValidate: true })} />
            {readErrorMessage(uploadForm.formState.errors, 'file') && <p className="text-sm text-destructive">{readErrorMessage(uploadForm.formState.errors, 'file')}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Target</label>
            <Select value={uploadTarget} onValueChange={(value) => onUploadTargetChange(value as 'COURSE' | 'MODULE')}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COURSE">Course</SelectItem>
                <SelectItem value="MODULE">Modul</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {uploadTarget === 'MODULE' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Modul</label>
              <Select value={selectedModuleId} onValueChange={onSelectedModuleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih modul" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Controller
            control={uploadForm.control}
            name="type"
            render={({ field }) => (
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipe</label>
                <Select value={field.value ?? 'AUTO'} onValueChange={(value) => field.onChange(value === 'AUTO' ? undefined : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDIA_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <Controller
            control={uploadForm.control}
            name="sortOrder"
            render={({ field }) => (
              <div className="space-y-2">
                <label className="text-sm font-medium">Urutan</label>
                <Input type="number" min={0} {...field} />
              </div>
            )}
          />

          <div className="flex items-end">
            <LoadingButton type="submit" variant="insidia" isLoading={isUploading} className="w-full">
              Upload Media
            </LoadingButton>
          </div>

          <div className="space-y-2 xl:col-span-3">
            <label className="text-sm font-medium">Alt</label>
            <Input value={uploadForm.watch('alt') ?? ''} {...uploadForm.register('alt')} />
          </div>

          <div className="space-y-2 xl:col-span-2">
            <label className="text-sm font-medium">Caption</label>
            <Textarea value={uploadForm.watch('caption') ?? ''} {...uploadForm.register('caption')} />
          </div>

          <Controller
            control={uploadForm.control}
            name="isPrimary"
            render={({ field }) => (
              <div className="space-y-2 xl:col-span-1">
                <label className="text-sm font-medium">Primary</label>
                <Select value={String(field.value)} onValueChange={(value) => field.onChange(value === 'true')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Primary" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Tidak</SelectItem>
                    <SelectItem value="true">Ya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </form>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat media...</p>
        ) : isError ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error instanceof Error ? error.message : 'Gagal memuat media course.'}</div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">Media Course</h3>
                <p className="text-sm text-muted-foreground">{groupedMedia.course.length} media langsung terhubung ke course.</p>
              </div>
              <MediaTable items={groupedMedia.course} onEdit={onEdit} onDelete={onDeleteTargetChange} />
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-medium">Media Modul</h3>
                <p className="text-sm text-muted-foreground">{groupedMedia.module.length} media terhubung ke modul.</p>
              </div>
              <MediaTable items={groupedMedia.module} onEdit={onEdit} onDelete={onDeleteTargetChange} />
            </div>
          </div>
        )}
      </CardContent>

      <Dialog open={isMetadataOpen} onOpenChange={onMetadataOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Metadata Media</DialogTitle>
            <DialogDescription>Perbarui caption, alt, urutan, atau tandai media sebagai primary.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={metadataForm.handleSubmit(onMetadataSubmit)}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Alt</label>
              <Input value={metadataForm.watch('alt') ?? ''} {...metadataForm.register('alt')} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Caption</label>
              <Textarea value={metadataForm.watch('caption') ?? ''} {...metadataForm.register('caption')} />
            </div>
            <Controller
              control={metadataForm.control}
              name="sortOrder"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Urutan</label>
                  <Input type="number" min={0} {...field} />
                </div>
              )}
            />
            <Controller
              control={metadataForm.control}
              name="isPrimary"
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary</label>
                  <Select value={String(field.value)} onValueChange={(value) => field.onChange(value === 'true')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Primary" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Tidak</SelectItem>
                      <SelectItem value="true">Ya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onMetadataOpenChange(false)} disabled={isUpdating}>
                Batal
              </Button>
              <LoadingButton type="submit" variant="insidia" isLoading={isUpdating}>
                Simpan Metadata
              </LoadingButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={Boolean(mediaToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            onDeleteTargetChange(null);
          }
        }}
        description={`Media "${mediaToDelete?.filename ?? mediaToDelete?.url ?? ''}" akan dihapus permanen.`}
        isLoading={isDeleting}
        onConfirm={onDelete}
      />
    </Card>
  );
}

function MediaTable({ items, onEdit, onDelete }: { items: ReturnType<typeof CourseMediaController>['media']; onEdit: (media: ReturnType<typeof CourseMediaController>['media'][number]) => void; onDelete: (media: ReturnType<typeof CourseMediaController>['media'][number]) => void; }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Ukuran</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Urutan</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                Belum ada media pada bagian ini.
              </TableCell>
            </TableRow>
          ) : (
            items.map((media) => (
              <TableRow key={media.id}>
                <TableCell>
                  <div className="space-y-1">
                    <a href={media.url} target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">
                      {media.filename ?? media.url}
                    </a>
                    <p className="text-xs text-muted-foreground">{media.caption ?? media.alt ?? '-'}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{media.type}</Badge>
                </TableCell>
                <TableCell>{bytesToSize(media.sizeBytes)}</TableCell>
                <TableCell>{media.module?.title ?? 'Course'}</TableCell>
                <TableCell>
                  <span className="text-sm">{media.sortOrder}</span>
                  {media.isPrimary && (
                    <Badge variant="success" className="ml-2">
                      Primary
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(media)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(media)}>
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
  );
}
