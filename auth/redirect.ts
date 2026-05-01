export const DEFAULT_AUTH_CALLBACK_URL = '/auth-redirect';
export const DEFAULT_LOGIN_CALLBACK_URL = DEFAULT_AUTH_CALLBACK_URL;

export function getSafeCallbackPath(callbackUrl?: string | null) {
  if (!callbackUrl) {
    return DEFAULT_LOGIN_CALLBACK_URL;
  }

  if (callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')) {
    return callbackUrl;
  }

  try {
    const url = new URL(callbackUrl);
    return `${url.pathname}${url.search}${url.hash}` || DEFAULT_LOGIN_CALLBACK_URL;
  } catch {
    return DEFAULT_LOGIN_CALLBACK_URL;
  }
}

export function getRoleLandingPath(role?: string | null) {
  if (role?.toUpperCase() === 'ADMIN') {
    return '/admin';
  }

  return '/';
}
