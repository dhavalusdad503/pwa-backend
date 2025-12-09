export interface CommonPaginationOptionType {
  page?: number;
  limit?: number;
  search?: string;
  sortColumn?: string;
  sortOrder?: string;
  searchableFields?: string[];
}

export interface CommonPaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
