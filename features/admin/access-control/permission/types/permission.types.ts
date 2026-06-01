import { AccessScope } from '../../types/access-control.types';

export type PermissionFormValues = {
  moduleId?: string;
  name: string;
  scope: 'INSIDIA' | 'MITRA';
  code: string;
  description: string;
};

export type Permission = {
  id: string;
  moduleId?: string | null;
  name: string;
  code: string;
  scope: AccessScope;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};
