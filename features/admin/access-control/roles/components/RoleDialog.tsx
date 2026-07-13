import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { AccessScope } from '../../types/access-control.types';
import { RolesForm } from '../form/roles.form';
import type { Role, RoleFormValues } from '../types/role.types';
type RoleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scope: AccessScope;
  role?: Role | null;
  isLoading: boolean;
  onSubmit: (values: RoleFormValues) => void;
};

export function RoleDialog({ open, onOpenChange, scope, role, isLoading, onSubmit }: RoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{role ? 'Edit Role' : 'Tambah Role'}</DialogTitle>
          <DialogDescription>Gunakan kode role yang konsisten karena backend menyimpan referensi role berdasarkan kode.</DialogDescription>
        </DialogHeader>
        <RolesForm scope={scope} role={role} onSubmit={onSubmit} isLoading={isLoading} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
