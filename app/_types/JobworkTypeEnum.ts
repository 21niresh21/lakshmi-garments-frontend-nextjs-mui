export enum JobworkTypeEnum {
  CUTTING = "CUTTING",
  STITCHING = "STITCHING",
  PACKAGING = "PACKAGING",
}

export const JobworkTypeEnumStatusColorMap = {
  CREATED: "info",
  ASSIGNED: "info",
  PACKAGING: "info",
} as const;

export const JOBWORK_TYPE_ARRAY = Object.values(
  JobworkTypeEnum,
) as JobworkTypeEnum[];
