import { apiFetchExternalData } from '@/lib/api/express.client';
import type { LoginEmailInput } from '../schema/auth.schema';
type RequestOtpLoginResponse = {
  message: string;
  expiresInSeconds: number;
  devOtp?: string;
  token: string;
};

export async function requestOtpLogin(data: LoginEmailInput): Promise<RequestOtpLoginResponse> {
  const res = apiFetchExternalData<RequestOtpLoginResponse>('/auth/request-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res;
}
