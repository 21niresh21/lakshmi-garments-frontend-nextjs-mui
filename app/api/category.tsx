import { Category } from "../_types/Category";
import axiosInstance from "../config/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl =  API_BASE_URL + "/categories";

export const fetchCategories = async (search?: string): Promise<Category[]> => {
  try {
    const url =
      search && search.trim()
        ? `${baseUrl}?search=${encodeURIComponent(search.trim())}`
        : baseUrl;

    const response = await axiosInstance.get<Category[]>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return []; // ✅ safe fallback for UI
  }
};
