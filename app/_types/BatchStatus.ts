export enum BatchStatus {
  CREATED = "CREATED",
  PACKAGED = "PACKAGED",
  WIP = "WIP",
  DISCARDED = "DISCARDED",
}

export const BatchStatusColorMap = {
  CREATED: "info",
  WIP: "warning",
  PACKAGED: "success",
  DISCARDED: "error",
} as const;
