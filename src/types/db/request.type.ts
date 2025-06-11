export interface optionResult {
  search?: string;
  sortBy?: 'views' | 'latest' | 'deadline';
  sortOrder?: 'ASC' | 'DESC'
  page?: number;
  limit?: number;
}