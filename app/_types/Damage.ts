import { DamageSource } from "./DamageSource";

export interface Damage {
  type: string;
  quantity: number | "";
  source?: DamageSource; // Optional - will be set based on damage type
  reworkJobworkNumber?: string | null;
}