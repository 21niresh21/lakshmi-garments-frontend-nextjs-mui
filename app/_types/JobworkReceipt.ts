import { JobworkReceiptItem } from "./JobworkReceiptItem";

export interface JobworkReceipt {
  jobworkNumber: string;
  receivedById: number;
  jobworkReceiptItems: JobworkReceiptItem[];
}

export interface ReceiptItemFormRow {
  itemId: number | null;
  quantity: number | null;
}
