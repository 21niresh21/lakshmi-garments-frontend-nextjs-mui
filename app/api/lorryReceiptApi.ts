import axiosInstance from "../config/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/lorry-receipts";

export const updateLorryReeipt = async (
  lrNumber: number,
  data: any
): Promise<void> => {
  try {
    const response = await axiosInstance.put(`${baseUrl}/${lrNumber}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
