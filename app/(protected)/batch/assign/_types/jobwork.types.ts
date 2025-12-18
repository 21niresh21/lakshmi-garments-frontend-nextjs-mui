import { Employee } from "@/app/_types/Employee";

export type JobworkForm = {
  serialCode: string;
  jobworkType: string;
  assignedBy?: number;
  employee: Employee | null;
};

export const INITIAL_JOBWORK: JobworkForm = {
  serialCode: "",
  jobworkType: "",
  assignedBy: undefined,
  employee: null,
};
