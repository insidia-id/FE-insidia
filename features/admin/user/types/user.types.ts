export type InsidiaRole = 'SUPER_ADMIN' | 'ADMIN' | 'MENTOR' | 'USER';
import type { MitraRole as AuthMitraRole } from '@/features/auth/types/auth.types';
export type MitraRole = 'AKADEMIK' | 'MURID' | 'GURU' | 'WALI_MURID';
export type RoleUser = InsidiaRole | MitraRole | 'ALL';
export type UserRoleCode = Exclude<RoleUser, 'ALL'>;
export type UserScope = 'INSIDIA' | 'MITRA';
export type StatusUser = 'ACTIVE' | 'SUSPENDED' | 'BANNED';
export type UserFilter = 'all' | 'available' | 'deleted';

export type UserQueryParams = {
  filter?: UserFilter;
  scope?: UserScope;
  roleCode?: RoleUser;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
};

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
    code: UserRoleCode;
  };
};

export type MitraProfile = {
  nip?: string | null;
  subject?: string | null;
  bio?: string | null;
  nis?: string | null;
  kelas?: string | null;
  jurusan?: string | null;
  waliId?: string | null;
  position?: string | null;
  division?: string | null;
  note?: string | null;
  pekerjaan?: string | null;
  alamat?: string | null;
};
export type UserMitraRoleRelation = UserRoleRelation & {
  mitraId: string;
  mitraName: string | null;
  mitraSlug: string | null;
  roleCode: MitraRole;
  profile?: MitraProfile | null;
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
  mitraRoles: UserMitraRoleRelation[] | null;
};
export type UsersResponse = {
  users: User[];
  total: number;
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
export type UserProfileForm = {
  id?: string | null;

  nis?: string | null;
  kelas?: string | null;
  jurusan?: string | null;
  waliId?: string | null;

  nip?: string | null;
  subject?: string | null;

  position?: string | null;
  division?: string | null;
  note?: string | null;

  expertise?: string | null;
  portfolio?: string | null;

  pekerjaan?: string | null;
  alamat?: string | null;
};
export type UserMitraAssignment = AuthMitraRole & {
  profile?: UserProfileForm;
};
