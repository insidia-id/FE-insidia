function requireEnv(value: string | undefined, name: string): string {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const publicEnv = {
  NEXT_PUBLIC_AUTH_API_URL: requireEnv(process.env.NEXT_PUBLIC_AUTH_API_URL, 'NEXT_PUBLIC_AUTH_API_URL'),
} as const;
