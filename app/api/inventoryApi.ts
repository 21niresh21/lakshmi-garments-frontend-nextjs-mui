import { Inventory } from "../_types/Inventory";
import axiosInstance from "../config/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/material-inventory";

export const fetchInventory = async (): Promise<Inventory[]> => {
  try {
    const response = await axiosInstance.get(baseUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};
