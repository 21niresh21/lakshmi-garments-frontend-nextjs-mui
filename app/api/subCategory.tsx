import { SubCategory } from "../_types/SubCategory";
import axiosInstance from "../config/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/sub-categories";

/**
 * Fetch sub-categories (optionally filtered by search)
 */
export const fetchSubCategories = async (
  search?: string
): Promise<SubCategory[]> => {
  try {
    const url =
      search && search.trim()
        ? `${baseUrl}?search=${encodeURIComponent(search.trim())}`
        : baseUrl;

    const response = await axiosInstance.get<SubCategory[]>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
    return []; // ✅ safe for autocomplete
  }
};
