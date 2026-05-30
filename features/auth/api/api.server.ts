import 'server-only';

import { cache } from 'react';
import { apiFetchWithAuth } from '@/lib/api/express.server';
import { mapAuthProfileResponse } from '../lib/auth.mapper';
import type { AuthProfileResponse } from '../types/auth.types';

export const getProfileUser = cache(async (): Promise<AuthProfileResponse | null> => {
  try {
    const res = await apiFetchWithAuth<AuthProfileResponse>('/auth/profile', {
      method: 'GET',
    });
    return mapAuthProfileResponse(res);
  } catch (error) {
    if ((error as { status?: number }).status === 401) {
      return null;
    }
    return null;
  }
});
