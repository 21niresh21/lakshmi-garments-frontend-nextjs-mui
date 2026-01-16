import { Item } from "@/app/_types/Item";
import { Damage } from "@/app/_types/Damage";

export interface JobworkItemRowData {
  id: string;

  item?: Item;
  itemId: number | null;   // ✅ FIXED
  itemName: string;
  wagePerItem: number | "";

  salesQuantity: number | "";
  salesPrice: number | "";
  acceptedQuantity: number | "";

  damages: Damage[];
}
