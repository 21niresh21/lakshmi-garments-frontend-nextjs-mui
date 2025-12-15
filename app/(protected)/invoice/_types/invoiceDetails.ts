export type InvoiceDetails = {
  invoiceNumber: string;
  invoiceDate: string;
  receivedDate: string;
  supplierID?: number;
  transportID?: number;
  transportCost?: number;
  istransportPaid: boolean;
};