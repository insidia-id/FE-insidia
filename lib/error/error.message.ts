import type { ApiClientError, ApiErrorIssue } from '@/lib/api/api.shared';

type ApiErrorResponse = {
  error?: {
    code?: string;
    message?: string;
    status?: number;
    errors?: ApiErrorIssue[];
  };
};

export function getMutationErrorMessage(error: unknown, fallbackMessage: string) {
  const responseData = error && typeof error === 'object' && 'response' in error ? (error as { response?: { data?: ApiErrorResponse } }).response?.data : undefined;
  const clientError = error && typeof error === 'object' ? (error as Partial<ApiClientError>) : undefined;
  const validationErrors = responseData?.error?.errors ?? (Array.isArray(clientError?.errors) ? clientError.errors : undefined);

  const firstValidationMessage = validationErrors?.find((item) => typeof item.message === 'string')?.message;

  if (firstValidationMessage) {
    return firstValidationMessage;
  }

  if (responseData?.error?.message) {
    return responseData.error.message;
  }

  if (typeof clientError?.message === 'string' && clientError.message) {
    return clientError.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}
