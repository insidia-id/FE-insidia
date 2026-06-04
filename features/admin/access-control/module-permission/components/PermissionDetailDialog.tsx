import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Permission } from '../../permission/types/permission.types';

type PermissionDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission: Permission | null;
};

export function PermissionDetailDialog({ open, onOpenChange, permission }: PermissionDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detail Permission</DialogTitle>
        </DialogHeader>

        {!permission ? null : (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold text-foreground">{permission.name}</p>
            </div>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{permission.code}</p>
            <p className="text-sm text-muted-foreground">{permission.description || 'Tanpa deskripsi'}</p>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
