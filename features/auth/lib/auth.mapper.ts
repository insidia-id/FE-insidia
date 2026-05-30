import { AuthProfileResponse, sessionResponse } from '../types/auth.types';

function normalizeMitraRoleResponse(mitraRole: AuthProfileResponse['mitraRoles']): AuthProfileResponse['mitraRoles'] {
  if (!mitraRole?.roleCode || !mitraRole.mitraId || !mitraRole.mitraName || !mitraRole.mitraSlug) {
    return null;
  }

  return mitraRole;
}

export function mapAuthProfileResponse(response: AuthProfileResponse): AuthProfileResponse {
  return {
    ...response,
    mitraRoles: normalizeMitraRoleResponse(response.mitraRoles),
  };
}
export function mapStatusSessionResponse(response: sessionResponse) {
  return {
    status: response.status,
    insidiaRole: response.insidiaRole.role.code,
    mitraRoles: normalizeMitraRoleResponse(
      response.mitraRoles
        ? {
            roleCode: response.mitraRoles.role.code,
            mitraName: response.mitraRoles.mitra.name,
            mitraSlug: response.mitraRoles.mitra.slug,
            mitraId: response.mitraRoles.mitra.id,
          }
        : null,
    ),
  };
}
