export const ACCESS_SCOPE = ['INSIDIA', 'MITRA'] as const;
export type AccessScope = (typeof ACCESS_SCOPE)[number];

export interface PaginationParams {
  page: number;
  limit: number;
}

export type PaginationResponse = {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginationState = {
  pageIndex: number;
  pageSize: number;
};
