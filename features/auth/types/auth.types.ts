import type { JWT } from 'next-auth/jwt';

export type AppUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
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
