export function readErrorMessage(errors: Record<string, unknown>, fieldName: string) {
  const error = errors[fieldName];

  if (!error || typeof error !== 'object' || !('message' in error) || typeof error.message !== 'string') {
    return null;
  }

  return error.message;
}
