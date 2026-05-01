import { z } from 'zod';

export const loginEmailSchema = z.object({
  email: z
    .email('Format email tidak valid')
    .trim()
    .min(1, 'Email wajib diisi')
    .max(254, 'Email terlalu panjang')
    .refine((email) => {
      const [localPart] = email.split('@');
      return localPart.length >= 3;
    }, 'Email tidak valid'),
});

export const verifyAuthOtpSchema = z.object({
  token: z.string().trim().min(1, 'Token tidak valid'),

  otp: z
    .string()
    .trim()
    .min(1, 'Kode OTP wajib diisi')
    .regex(/^\d{6}$/, 'Kode OTP harus 6 digit angka'),
});
export type LoginEmailInput = z.infer<typeof loginEmailSchema>;
export type VerifyAuthOtpInput = z.infer<typeof verifyAuthOtpSchema>;
