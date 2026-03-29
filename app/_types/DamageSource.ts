export enum DamageSource {
  CURRENT_JOBWORK = "CURRENT_JOBWORK",
  PREVIOUS_JOBWORK = "PREVIOUS_JOBWORK",
}

export const damageSourceOptions = Object.values(DamageSource);

export const DamageSourceLabels: Record<DamageSource, string> = {
  [DamageSource.CURRENT_JOBWORK]: "Current Jobwork",
  [DamageSource.PREVIOUS_JOBWORK]: "Previous Jobwork",
};
