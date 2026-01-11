export interface BatchFilter {
  categoryNames: string[];
  batchStatus: string[];
  isUrgent: boolean[];
  // createdBy?: string;
  startDate?: string; // yyyy-MM-dd
  endDate?: string;   // yyyy-MM-dd
}
