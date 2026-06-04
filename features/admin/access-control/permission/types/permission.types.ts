import { AccessScope } from '../../types/access-control.types';

export type PermissionFormValues = {
  moduleId?: string;
  name: string;
  code: string;
  description: string;
};

export type Permission = {
  id: string;
  moduleId?: string | null;
  name: string;
  code: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};
