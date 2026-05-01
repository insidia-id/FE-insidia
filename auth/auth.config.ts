import NextAuth from 'next-auth';
import type { Provider } from '@auth/core/providers';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { verifyAuthOtp, refreshAccessTokenOnce, exchangeGoogleLogin } from '@/features/auth/api/api';
import { verifyAuthOtpSchema } from '@/features/auth/schema/auth.schema';
import { AppToken } from '../features/auth/types/auth.types';
import { clearAuthToken, mergeTokenWithUser, toGoogleExchangePayload, toNextAuthUser } from '../features/auth/auth.utils';

const secret = process.env.BETTER_AUTH_SECRET;

if (!secret) {
  throw new Error('BETTER_AUTH_SECRET is not defined in environment variables');
}

const googleClientId = process.env.AUTH_GOOGLE_ID;
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET;

const providers: Provider[] = [
  Credentials({
    credentials: {
      token: { type: 'text' },
      otp: { type: 'text' },
    },
    async authorize(creds) {
      try {
        const parsed = verifyAuthOtpSchema.safeParse({
          token: creds?.token,
          otp: creds?.otp,
        });

        if (!parsed.success) return null;

        const { token, otp } = parsed.data;
        const result = await verifyAuthOtp({ token, otp });
        if (!result) return null;

        return toNextAuthUser(result);
      } catch (err) {
        console.error('AUTHORIZE ERROR', err);
        return null;
      }
    },
  }),
];

if (googleClientId && googleClientSecret) {
  providers.push(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  );
}

export const { handlers, auth, signOut } = NextAuth({
  secret,
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 3 },
  pages: {
    signIn: '/login',
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') {
        return true;
      }

      if (!user.email || !account.providerAccountId) {
        return '/login?error=GoogleSigninFailed';
      }
      try {
        const result = await exchangeGoogleLogin(toGoogleExchangePayload(user, account));

        if (!result) {
          return '/login?error=GoogleSigninFailed';
        }

        Object.assign(user, toNextAuthUser(result));
        return true;
      } catch (error) {
        console.error('GOOGLE_SIGNIN_ERROR', error);
        return '/login?error=GoogleSigninFailed';
      }
    },
    async jwt({ token, user }) {
      if (user?.accessToken && user.refreshToken && user.accessTokenExpiresAt && user.refreshTokenExpiresAt) {
        return mergeTokenWithUser(token as AppToken, user);
      }

      if (typeof token.refreshTokenExpiresAt !== 'number' || Date.now() >= token.refreshTokenExpiresAt) {
        return clearAuthToken(token as AppToken, 'SessionExpired');
      }

      if (typeof token.accessTokenExpiresAt === 'number' && Date.now() < token.accessTokenExpiresAt - 5_000) {
        return token;
      }

      const refreshed = await refreshAccessTokenOnce(token as AppToken);

      return refreshed;
    },

    async session({ session, token }) {
      if (token.error === 'SessionExpired' || !token.accessToken || !token.user) {
        return {
          ...session,
          user: undefined,
          error: token.error,
        };
      }

      if (token.user) {
        session.user = {
          ...session.user,
          ...token.user,
        };
      }

      session.error = token.error;
      return session;
    },
  },
});
