// Types for Jobwork Timeline Response

export interface Damage {
  quantity: number;
  damageType: "REPAIRABLE" | "UNREPAIRABLE" | "SUPPLIER_DAMAGE";
  damageSource: string | null;
  reworkJobworkNumber: string | null;
}

export interface ReceiptItem {
  itemName: string;
  acceptedQuantity: number;
  damagedQuantity: number;
  salesQuantity: number;
  wagePerItem: number;
  salesPrice: number;
  damages: Damage[];
}

export interface JobworkReceipt {
  receiptId: number;
  receivedAt: string;
  recordedBy: string;
  receiptItems: ReceiptItem[];
  totalAccepted: number;
  totalDamaged: number;
  totalSales: number;
  receiptWages: number;
}

export interface JobworkTimelineItem {
  itemName: string;
  quantity: number;
  acceptedQuantity: number | null;
  damagedQuantity: number | null;
  salesQuantity: number | null;
}

export interface TimelineEvent {
  eventType: 
    | "JOBWORK_ASSIGNED" 
    | "JOBWORK_RECEIPT" 
    | "JOBWORK_COMPLETED" 
    | "JOBWORK_REASSIGNED"
    | "JOBWORK_REOPENED"
    | "JOBWORK_CLOSED";
  message: string;
  performedAt: string;
  performedBy: string;
  stage: string;
  timeTakenFromPrevious: string;
  quantityAffected: number | null;
  items: JobworkTimelineItem[] | null;
}

export interface JobworkItem {
  itemName: string;
  issuedQuantity: number;
  acceptedQuantity: number;
  damagedQuantity: number;
  salesQuantity: number;
  pendingQuantity: number;
  status: string;
}

export interface JobworkMetrics {
  totalIssued: number;
  totalAccepted: number;
  totalDamaged: number;
  totalSales: number;
  totalPending: number;
  totalWagesEarned: number;
  totalSalesDeduction: number;
  netWagesEarned: number;
  completionPercentage: string;
  receiptCount: number;
  averageTimePerReceipt: string;
  totalDuration: string;
  damageRate: number;
  salesRate: number;
  acceptanceRate: number;
  efficiencyScore: string;
  reworkCount: number;
}

export interface JobworkTimelineResponse {
  id: number;
  jobworkNumber: string;
  jobworkType: string;
  jobworkStatus: string;
  jobworkOrigin: "ORIGINAL" | "REWORK" | "REASSIGNED";
  batchSerialCode: string;
  assignedTo: string;
  remarks: string | null;
  createdBy: string;
  createdAt: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
  parentJobworkNumber: string | null;
  childJobworkNumbers: string[];
  items: JobworkItem[];
  metrics: JobworkMetrics;
  receipts: JobworkReceipt[];
  timeline: TimelineEvent[];
}
