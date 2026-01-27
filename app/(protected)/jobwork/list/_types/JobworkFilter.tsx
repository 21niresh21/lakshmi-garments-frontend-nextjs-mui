export interface JobworkFilter {
  // Global search (jobworkNumber)
  search?: string;

  // Enums passed as strings or string arrays
  jobworkStatus?: string[]; 
  jobworkType?: string[];

  // Relationships
  assignedToName?: string[];
  batchSerialCode?: string[];

  // Dates (Using string to match JSON serialization)
  startDate?: string; // ISO format or yyyy-MM-dd
  endDate?: string;   // ISO format or yyyy-MM-dd
}