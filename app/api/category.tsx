import { Category } from "../_types/Category";
import { CategoryFormData } from "../components/shared/CategoryFormModal";
import axiosInstance from "../config/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/categories";

export const addCategory = async (
  categoryData: CategoryFormData
): Promise<Category> => {
  try {
    const response = await axiosInstance.post<Category>(baseUrl, categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

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
    throw error;
  }
};

export const updateCategory = async (
  categoryId: number,
  updatedData: CategoryFormData
) => {
  try {
    const response = await axiosInstance.put(
      `${baseUrl}/${categoryId}`,
      updatedData
    );

    return response.data; // return only data (best practice)
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};
