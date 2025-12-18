export interface FetchBatchesParams {
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  batchStatusNames?: string[];
  categoryNames?: string[];
  isUrgent?: boolean[];
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}
