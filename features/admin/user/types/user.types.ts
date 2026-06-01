export type InsidiaRole = 'SUPER_ADMIN' | 'ADMIN' | 'MENTOR' | 'USER';
export type MitraRole = 'AKADEMIK' | 'MURID' | 'GURU' | 'WALI_MURID';
export type RoleUser = InsidiaRole | MitraRole;
export type UserScope = 'INSIDIA' | 'MITRA';
export type StatusUser = 'ACTIVE' | 'SUSPENDED' | 'BANNED';
export type UserFilter = 'all' | 'available' | 'deleted';
export type SocialLinks = {
  instagram?: string;
  linkedin?: string;
  github?: string;
};
export type UserRoleRelation = {
  id: string;
  roleId: string;
  role: {
    id: string;
    scope: UserScope;
    code: RoleUser;
  };
};

export type UserMitraRoleRelation = {
  id: string;
  roleId: string;
  mitraId: string;
  role: {
    id: string;
    scope: UserScope;
    code: RoleUser;
  };
};

export type User = {
  id: string;
  email: string;
  name: string | null;
  status: StatusUser;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  insidiaRole: UserRoleRelation | null;
  mitraRoles: UserMitraRoleRelation | null;
};
export type UserDetail = User & {
  normalizedEmail: string;
  emailVerified: boolean;
  phone: string | null;
  image: string | null;
  phoneVerifiedAt: string | null;
  bio: string | null;
  websiteUrl: string | null;
  socialLinks?: SocialLinks | null;
  createdById: string | null;
};

export type BulkUserPreviewResult = {
  jobId: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  canImport: boolean;
};

export type BulkUserImportResult = {
  jobId: string;
  status: string;
};
