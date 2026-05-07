export type RoleUser = 'ADMIN' | 'ADMIN_MENTOR' | 'ADMIN_AKADEMIK' | 'MENTOR' | 'AKADEMIK' | 'GURU' | 'MURID' | 'WALI_MURID' | 'USER_BIASA';
export type StatusUser = 'ACTIVE' | 'SUSPENDED' | 'BANNED';
export type UserFilter = 'all' | 'active' | 'deleted';
export type SocialLinks = {
  instagram?: string;
  linkedin?: string;
  github?: string;
};
export type User = {
  id: string;
  email: string;
  name: string | null;
  role: RoleUser;
  status: StatusUser;
  createdAt: Date;
  deletedAt?: Date | null;
};
export type UserDetail = User & {
  normalizedEmail: string;
  emailVerified: boolean;
  phone: string | null;
  image: string | null;
  phoneVerifiedAt: string | null;
  bio: string | null;
  headline: string | null;
  websiteUrl: string | null;
  socialLinks?: SocialLinks | null;
  createdById: string | null;
};
