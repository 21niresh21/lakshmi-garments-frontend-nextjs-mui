import { Employee } from "../_types/Employee";
import axiosInstance from "../config/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/generate-pdf";

export const fetchJobworkPdf = async (data: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`${baseUrl}/jobwork`, data, {
      responseType: "blob",
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching jobwork pdf:", error);
    throw error;
  }
};
