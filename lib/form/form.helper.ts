export function readErrorMessage(errors: Record<string, unknown>, fieldName: string) {
  const error = fieldName.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') {
      return null;
    }

    return (current as Record<string, unknown>)[segment];
  }, errors);

  if (!error || typeof error !== 'object' || !('message' in error) || typeof error.message !== 'string') {
    return null;
  }

  return error.message;
}
