import { FieldErrors } from "@/app/_types/errors";

export type BaleErrors = FieldErrors<BaleDetails>;

export const INITIAL_BALE: BaleDetails = {
  id: 0,
  baleNumber: "",
  quality: "",
  quantity: 0,
  category: undefined,
  subCategory: undefined,
  length: 0,
  price: 0,
};

export type BaleDetails = {
  id: number;
  baleNumber: string;
  quantity: number | ""; 
  length: number | "";
  price: number | "";
  quality: string;
  category?: string;
  subCategory?: string;
};
