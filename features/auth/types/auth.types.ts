import { PermissionCode } from '@/features/admin/types/Admin';
import { InsidiaRole, StatusUser } from '@/features/admin/user/types/user.types';
import type { JWT } from 'next-auth/jwt';

export type AppUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  permissions: string[];
  image: string | null;
};

export type OAuthAccountPayload = {
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
};

export type GoogleExchangePayload = {
  email: string;
  name?: string | null;
  image?: string | null;
  account: OAuthAccountPayload;
};

export type AppAuthResponse = {
  user: AppUser;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresInSeconds: number;
  refreshTokenExpiresInSeconds: number;
};

export type SessionError = 'SessionExpired' | 'RefreshAccessTokenError' | 'GoogleExchangeError';

export interface AppToken extends JWT {
  user?: AppUser;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: number;
  refreshTokenExpiresAt?: number;
  error?: SessionError;
}

export type RefreshResponse = {
  data?: {
    user?: AppToken['user'];
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresInSeconds?: number;
    refreshTokenExpiresInSeconds?: number;
  };
  user?: AppToken['user'];
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresInSeconds?: number;
  refreshTokenExpiresInSeconds?: number;
};

export type MentorProfile = {
  id: string;
  expertise: string | null;
  portfolio: string | null;
};

export type GuruProfile = {
  id: string;
  nip: string | null;
  subject: string | null;
};

export type MuridProfile = {
  id: string;
  nis: string | null;
  kelas: string | null;
  jurusan: string | null;
  waliId: string | null;
};

export type WaliMuridProfile = {
  id: string;
  pekerjaan: string | null;
  alamat: string | null;
};

export type AcademicProfile = {
  id: string;
  position: string | null;
  division: string | null;
  note: string | null;
};

export type UserRoleProfile = MentorProfile | GuruProfile | MuridProfile | WaliMuridProfile | AcademicProfile | null;
export type MitraRole = {
  roleCode: string;
  mitraId: string;
  mitraName: string;
  mitraSlug: string;
};
export type AuthProfileResponse = {
  id: string;
  email: string;
  name: string | null;
  status: StatusUser;
  image: string | null;

  insidiaRole: InsidiaRole;
  mitraRoles: MitraRole | null;
  permissions: PermissionCode[];
};

export type sessionResponse = {
  status: string;
  insidiaRole: {
    role: {
      code: string;
    };
  };
  mitraRoles: {
    role: {
      code: string;
    };
    mitra: {
      id: string;
      name: string;
      slug: string;
    };
  } | null;
};
export type MiddlewareSessionRequest = {
  auth: {
    user?: {
      role?: string | null;
    } | null;
    error?: unknown;
  } | null;
  nextUrl: {
    protocol: string;
    toString(): string;
  };
  headers: Headers;
};
export type ResolvedSessionState =
  | {
      status: 'ACTIVE';
      insidiaRole: string;
      mitraRoles: MitraRole | null;
    }
  | 'UNAUTHORIZED'
  | 'BANNED'
  | null;
