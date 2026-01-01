import { Employee } from "@/app/_types/Employee";
import { Item } from "@/app/_types/Item";

export type ItemEntry = {
  item: Item | null;
  quantity?: number;
};

export type JobworkForm = {
  jobworkNumber : string,
  serialCode: string;
  jobworkType: string;
  assignedBy?: number;
  employee: Employee | null;
  quantity? : number 
  remarks?: string;
  quantities?: number[],
  itemNames?: string[],
  items: ItemEntry[];
};

export const INITIAL_JOBWORK: JobworkForm = {
  jobworkNumber : "",
  serialCode: "",
  jobworkType: "",
  assignedBy: undefined,
  employee: null,
  quantity : undefined,
  remarks : "",
  items: []
};
