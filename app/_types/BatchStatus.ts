export enum BatchStatus {
  CREATED = "CREATED",
  CLOSED = "CLOSED",
  ASSIGNED = "ASSIGNED",
  DISCARDED = "DISCARDED",
  COMPLETED = "COMPLETED"
}

export const BatchStatusColorMap = {
  CREATED: "info",
  ASSIGNED: "warning",
  CLOSED: "success",
  DISCARDED: "error",
  COMPLETED: "info"
} as const;

export const BATCH_STATUS_ARRAY = Object.values(BatchStatus) as BatchStatus[];
