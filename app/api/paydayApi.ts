import { PaydaySummary } from "../_types/PaydaySummary";
import axiosInstance from "../config/axiosConfig";
import { PaydayParams } from "./_types/PaydayParams";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/payday";

export const getPaydaySummary = async (params: PaydayParams): Promise<any> => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/summary`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};
