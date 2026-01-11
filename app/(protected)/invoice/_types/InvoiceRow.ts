interface InvoiceRow {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  receivedDate: string;
  supplierName: string;
  transportName: string;
  transportCost: number;
  isTransportPaid: boolean;
}