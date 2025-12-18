import { FieldErrors } from "@/app/_types/errors";
import { InvoiceDetails } from "../_types/invoiceDetails";
import { LRDetails } from "../_types/LRDetails";
import { Bale } from "../_types/Bale";

export type InvoiceErrors = FieldErrors<InvoiceDetails>;

export const INITIAL_INVOICE: InvoiceDetails = {
  invoiceNumber: "",
  invoiceDate: "",
  receivedDate: "",
  supplierID: undefined,
  transportID: undefined,
  transportCost: 0,
  istransportPaid: false,
};

export const INITIAL_LR: LRDetails = {
  lorryReceipts: [],
  transportType: "transport",
};

export type BaleErrors = Partial<Record<keyof Bale, string>>;
export type LRErrors = {
  lrNumber?: string;
  bales?: Record<string, BaleErrors>; // baleId -> errors
};