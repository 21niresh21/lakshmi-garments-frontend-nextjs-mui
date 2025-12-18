export interface BatchFilters {
  categoryNames: string[];
  batchStatusNames: string[];
  isUrgent: boolean[];
  createdBy?: string;
  startDate?: string; // yyyy-MM-dd
  endDate?: string;   // yyyy-MM-dd
}
