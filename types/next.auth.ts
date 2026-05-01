import type { DefaultSession } from 'next-auth';
import type { DefaultUser } from '@auth/core/types';
import type { AppUser, SessionError } from '@/features/auth/types/auth.types';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    email: string;
    name: string | null;
    role: string;
    image: string | null;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresAt?: number;
    refreshTokenExpiresAt?: number;
  }

  interface Session {
    user?: AppUser & DefaultSession['user'];
    error?: SessionError;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: AppUser;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresAt?: number;
    refreshTokenExpiresAt?: number;
    error?: SessionError;
  }
}
