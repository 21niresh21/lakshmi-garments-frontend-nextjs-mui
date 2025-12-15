import { Transport } from "../(protected)/invoice/_types/transport";
import axiosInstance from "../config/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

const baseUrl = API_BASE_URL + "/transports";

export const fetchTransports = async (
  search?: string
): Promise<Transport[]> => {
  try {
    const url = search
      ? `${baseUrl}?search=${encodeURIComponent(search)}`
      : baseUrl;
    const response = await axiosInstance.get<Transport[]>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching transports", error);
    return [];
  }
};
