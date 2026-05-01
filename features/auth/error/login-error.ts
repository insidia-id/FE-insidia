const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: 'Akses login ditolak.',
  Configuration: 'Konfigurasi login Google belum lengkap.',
  CredentialsSignin: 'Kode OTP tidak valid atau sudah kedaluwarsa.',
  GoogleSigninFailed: 'Login Google gagal. Silakan coba lagi.',
  OAuthAccountNotLinked: 'Email ini sudah terhubung ke metode login lain.',
};

export function getLoginErrorMessage(error: string | null) {
  if (!error) return null;
  return LOGIN_ERROR_MESSAGES[error] ?? 'Login gagal. Silakan ulangi beberapa saat lagi.';
}
