export interface WorkflowRequestParams {
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  //   search?: string;
  requestedByNames?: string[];
  requestTypes?: string[];
  statuses?: string[];
  startDate?: string;
  endDate?: string;
}
