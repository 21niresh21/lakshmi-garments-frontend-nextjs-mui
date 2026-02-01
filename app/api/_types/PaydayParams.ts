export interface PaydayParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  employeeName?: string;
  fromDate?: string;
  toDate?: string;
}
