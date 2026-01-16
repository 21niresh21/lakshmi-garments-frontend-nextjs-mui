import { Employee } from "@/app/_types/Employee";
import { Item } from "@/app/_types/Item";

export type ItemEntry = {
  rowId: string;  
  item: Item | null;
  quantity?: number;
};

export type JobworkForm = {
  jobworkNumber : string,
  batchSerialCode: string;
  jobworkType: string;
  assignedTo : string;
  // employee: Employee | null;
  quantity? : number 
  remarks?: string;
  quantities?: number[],
  itemNames?: string[],
  items: ItemEntry[];
};

export const INITIAL_JOBWORK: JobworkForm = {
  jobworkNumber : "",
  batchSerialCode: "",
  jobworkType: "",
  assignedTo : "",
  // employee: null,
  quantity : undefined,
  remarks : "",
  items: []
};
