import { Supplier } from "../(protected)/invoice/_types/supplier";
import axiosInstance from "../config/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// Base URL for supplier APIs
const baseUrl = API_BASE_URL + "/suppliers";

/**
 * Fetch suppliers optionally filtered by search string
 * @param search optional search term
 * @returns Promise<Supplier[]>
 */
export const fetchSuppliers = async (search?: string): Promise<Supplier[]> => {
  try {
    const url = search
      ? `${baseUrl}?search=${encodeURIComponent(search)}`
      : baseUrl;
    const response = await axiosInstance.get<Supplier[]>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching suppliers", error);
    return [];
  }
};
