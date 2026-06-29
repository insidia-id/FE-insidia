export function academicPath(path: string) {
  return `/api/mitras/active/academic/${path}`;
}

export function withQuery(path: string, query?: Record<string, string | undefined>) {
  const params = new URLSearchParams();

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  return params.size ? `${path}?${params.toString()}` : path;
}
