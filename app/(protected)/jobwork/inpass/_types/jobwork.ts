import { Item } from "@/app/_types/Item";
import { Damage } from "@/app/_types/Damage";

export interface JobworkItemRowData {
  id: string;

  item?: Item;
  itemId: number | null;   // ✅ FIXED
  itemName: string;
  wage: number | "";

  purchasedQuantity: number | "";
  purchaseCost: number | "";
  returnedQuantity: number | "";

  damages: Damage[];
}
