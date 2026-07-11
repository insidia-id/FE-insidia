export const mitraAcademicKeys = {
  all: ['mitra-academic'] as const,
  resource: (resource: string) => [...mitraAcademicKeys.all, resource] as const,
};
