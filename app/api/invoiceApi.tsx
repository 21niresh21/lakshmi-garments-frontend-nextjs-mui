import { InvoiceDetails } from "../(protected)/invoice/_types/invoiceDetails";
import axiosInstance from "../config/axiosConfig";
import { InvoiceParams } from "./_types/InvoiceParams";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/invoices";

export const createStock = async (data: any): Promise<any> => {
  try {
    const response = await axiosInstance.post("/shipments", data);
    console.log("Stock created successfully:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchInvoices = async (params?: InvoiceParams) => {
  try {
    const response = await axiosInstance.get(baseUrl, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const updateInvoice = async (
  invoiceId: number,
  updatedData: InvoiceDetails
) => {
  try {
    const response = await axiosInstance.patch(
      `${baseUrl}/${invoiceId}`,
      updatedData
    );
    return response;
  } catch (error) {
    console.error("error updating invoice", error);
  }
};

export const fetchInvoiceDetail = async (invoiceId: string) => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/${invoiceId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice details:", error);
    throw error;
  }
};
