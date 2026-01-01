import axiosInstance from "../config/axiosConfig";
import { JobworkParams } from "./_types/JobworkParams";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/jobwork-receipts";

export const createJobworkReceipt = async (data: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`${baseUrl}`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating jobwork receipt:", error);
    throw error;
  }
};
