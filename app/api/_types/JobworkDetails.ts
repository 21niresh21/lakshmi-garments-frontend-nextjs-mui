export interface JobworkItem {
    itemName: string;
    issuedQuantity: number;
    acceptedQuantity: number;
    damagedQuantity: number;
    salesQuantity: number;
    salesPrice: number;
    wagePerItem: number;
    status: string;
    damageBreakdown: Record<string, number>;
}

export interface DetailedJobwork {
    jobworkNumber: string;
    jobworkType: string;
    jobworkStatus: string;
    batchSerialCode: string;
    startedAt: string;
    lastUpdatedAt: string;
    remarks: string;
    items: JobworkItem[];
}

export interface DetailedJobworkStats {
    totalJobworks: number;
    totalIssuedQuantity: number;
    totalAcceptedQuantity: number;
    totalDamagedQuantity: number;
    totalSalesQuantity: number;
    damageBreakdown: Record<string, number>;
}

export interface EmployeeJobworkDetailedResponse {
    jobworks: DetailedJobwork[];
    stats: DetailedJobworkStats;
}
