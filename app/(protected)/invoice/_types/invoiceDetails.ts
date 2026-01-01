export type InvoiceDetails = {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  receivedDate: string;
  supplierID?: number;
  transportID?: number;
  supplierName? : string;
  transportName? : string;
  transportCost?: number;
  isTransportPaid: boolean;
};

