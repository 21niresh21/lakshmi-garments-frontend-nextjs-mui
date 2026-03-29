// Types for Batch Timeline Response

export interface BatchItem {
  itemId: number;
  itemName: string;
  quantity: number;
}

export interface BatchSubCategory {
  id: number;
  subCategoryName: string;
  originalQuantity: number;
  availableQuantity: number;
}

export interface ProgressInfo {
  totalQuantity: number;
  completedQuantity: number;
  firstStartedAt: string | null;
  progressPercentage: string;
}

export interface PreCuttingQuantity {
  totalQuantity: number;
  assignedQuantity: number;
  consumedQuantity: number;
}

export interface PostCuttingQuantity {
  totalQuantity: number;
  assignedQuantity: number;
  acceptedQuantity: number;
  damagedQuantity: number;
  salesQuantity: number;
  repairableDamage: number;
  unrepairableDamage: number;
  supplierDamage: number;
}

export interface QuantityFlow {
  preCutting: PreCuttingQuantity;
  postCutting: PostCuttingQuantity;
  currentAvailableQuantity: number;
}

export interface AssignedItem {
  itemName: string;
  quantity: number;
  itemStatus: string;
}

export interface BatchJobwork {
  jobworkId: number;
  jobworkNumber: string;
  jobworkType: "CUTTING" | "STITCHING" | "PACKAGING";
  jobworkOrigin: "ORIGINAL" | "REWORK" | "REASSIGNED";
  jobworkStatus: string;
  assignedTo: string;
  remarks: string | null;
  assignedAt: string;
  createdBy: string;
  parentJobworkNumber: string | null;
  assignedItems: AssignedItem[];
  receipts: any[];
  totalAssignedQuantity: number;
  totalAcceptedQuantity: number;
  totalDamagedQuantity: number;
  totalSalesQuantity: number;
}

export interface BatchTimelineItem {
  itemName: string;
  quantity: number;
  acceptedQuantity: number | null;
  damagedQuantity: number | null;
  salesQuantity: number | null;
}

export interface BatchTimelineEvent {
  eventType: 
    | "BATCH_CREATED" 
    | "JOBWORK_ASSIGNED" 
    | "JOBWORK_RECEIPT" 
    | "JOBWORK_COMPLETED" 
    | "JOBWORK_CLOSED"
    | "JOBWORK_REASSIGNED"
    | "BATCH_COMPLETED";
  message: string;
  performedAt: string;
  performedBy: string;
  stage: string;
  timeTakenFromPrevious: string;
  jobworkNumber: string | null;
  jobworkType: string | null;
  employeeName: string | null;
  totalQuantity: number;
  acceptedQuantity: number | null;
  damagedQuantity: number | null;
  salesQuantity: number | null;
  items: BatchTimelineItem[];
}

export interface BatchStats {
  totalEvents: number;
  totalJobworks: number;
  totalReceipts: number;
  totalDurationFromCreation: string;
  firstEventAt: string;
  lastEventAt: string;
  totalDurationFromItemCreation: string;
  cuttingJobworkCount: number;
  stitchingJobworkCount: number;
  packagingJobworkCount: number;
  uniqueEmployeesAssigned: number;
  averageTimeBetweenJobworks: string;
  averageTimeBetweenReceipts: string;
  totalWagesPaid: number;
  totalSalesRevenue: number;
  totalCostOfProduction: number;
  totalItemsProduced: number;
  totalItemsAccepted: number;
  totalItemsDamaged: number;
  totalItemsSold: number;
  overallAcceptanceRate: number;
  overallDamageRate: number;
  overallSalesRate: number;
  productionEfficiencyScore: string;
  totalReworkCount: number;
  estimatedCompletionTime: string;
}

export interface BatchTimelineResponse {
  batchId: number;
  serialCode: string;
  categoryName: string;
  batchStatus: string;
  isUrgent: boolean;
  remarks: string | null;
  createdBy: string;
  createdAt: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
  items: BatchItem[];
  subCategories: BatchSubCategory[];
  cuttingProgress: ProgressInfo;
  stitchingProgress: ProgressInfo;
  packagingProgress: ProgressInfo;
  quantityFlow: QuantityFlow;
  jobworks: BatchJobwork[];
  timeline: BatchTimelineEvent[];
  stats: BatchStats;
}
