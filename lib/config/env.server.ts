import 'server-only';

function requireEnv(value: string | undefined, name: string): string {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const serverEnv = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',

  API_URL: requireEnv(process.env.API_URL, 'API_URL'),
  INTERNAL_AUTH_TOKEN: requireEnv(process.env.INTERNAL_AUTH_TOKEN, 'INTERNAL_AUTH_TOKEN'),
  AUTH_GOOGLE_SECRET: requireEnv(process.env.AUTH_GOOGLE_SECRET, 'AUTH_GOOGLE_SECRET'),
  AUTH_GOOGLE_ID: requireEnv(process.env.AUTH_GOOGLE_ID, 'AUTH_GOOGLE_ID'),
  BETTER_AUTH_SECRET: requireEnv(process.env.BETTER_AUTH_SECRET, 'BETTER_AUTH_SECRET'),
  DEBUG_AUTH_TIMING: process.env.DEBUG_AUTH_TIMING ?? 'false',
} as const;
