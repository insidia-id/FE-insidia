export const ACCESS_SCOPE = ['INSIDIA', 'MITRA'] as const;
export type AccessScope = (typeof ACCESS_SCOPE)[number];
