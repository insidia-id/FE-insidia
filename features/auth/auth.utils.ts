import type { User } from 'next-auth';
import type { Account } from 'next-auth';
import type { AppAuthResponse, AppToken, AppUser, GoogleExchangePayload, SessionError } from './types/auth.types';
const INTERNAL_AUTH_TOKEN = process.env.INTERNAL_AUTH_TOKEN;

export function toAppUser(user: AppAuthResponse['user']): AppUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    role: user.role,
    permissions: user.permissions ?? [],
    image: user.image ?? null,
  };
}

export function toNextAuthUser(data: AppAuthResponse): User {
  return {
    ...toAppUser(data.user),
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    accessTokenExpiresAt: Date.now() + data.accessTokenExpiresInSeconds * 1000,
    refreshTokenExpiresAt: Date.now() + data.refreshTokenExpiresInSeconds * 1000,
  };
}

export function mergeTokenWithUser(token: AppToken, user: User): AppToken {
  return {
    ...token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name ?? null,
      role: user.role,
      permissions: user.permissions ?? [],
      image: user.image ?? null,
    },
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
    accessTokenExpiresAt: user.accessTokenExpiresAt,
    refreshTokenExpiresAt: user.refreshTokenExpiresAt,
    error: undefined,
  };
}

export function clearAuthToken(token: AppToken, error: SessionError): AppToken {
  return {
    ...token,
    user: undefined,
    accessToken: undefined,
    refreshToken: undefined,
    accessTokenExpiresAt: undefined,
    refreshTokenExpiresAt: undefined,
    error,
  };
}

export function toGoogleExchangePayload(user: User, account: Account): GoogleExchangePayload {
  return {
    email: user.email ?? '',
    name: user.name ?? null,
    image: user.image ?? null,
    account: {
      type: account.type,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      refresh_token: account.refresh_token ?? null,
      access_token: account.access_token ?? null,
      expires_at: account.expires_at ?? null,
      token_type: account.token_type ?? null,
      scope: account.scope ?? null,
      id_token: account.id_token ?? null,
      session_state: typeof account.session_state === 'string' ? account.session_state : null,
    },
  };
}
export function getInternalAuthToken(): string {
  if (!INTERNAL_AUTH_TOKEN) {
    throw new Error('Missing INTERNAL_AUTH_TOKEN');
  }

  return INTERNAL_AUTH_TOKEN;
}
