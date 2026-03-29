import { DamageSource } from "./DamageSource";

export interface Damage {
  type: string;
  quantity: number | "";
  source: DamageSource;
}