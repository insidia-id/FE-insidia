import { AuthProfileResponse, sessionResponse } from '../types/auth.types';

export function mapAuthProfileResponse(response: AuthProfileResponse): AuthProfileResponse {
  return {
    ...response,
  };
}

export function mapStatusSessionResponse(response: sessionResponse) {
  return {
    status: response.status,
    insidiaRole: response.insidiaRole.role.code,
    mitraRoles: response.mitraRoles,
  };
}
