import { Damage } from "./Damage";

export interface JobworkReceiptItem {
  itemId: number; // frontend only
  itemName: string; // backend expects this
  returnedQuantity: number;
  purchaseQuantity: number;
  purchaseCost: number;
  wage: number;
  damages: Damage[];
}
