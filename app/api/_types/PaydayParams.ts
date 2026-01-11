export interface PaydayParams {
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  employeeName?: string;
  fromDate?: string;
  toDate?: string;
}
