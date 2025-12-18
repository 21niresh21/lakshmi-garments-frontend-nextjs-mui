import { Skill } from "./Skill";

export interface Employee {
  id: number;
  name: string;
  skills: Skill[]
}