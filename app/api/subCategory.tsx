import { SubCategory } from "../_types/SubCategory";
import { SubCategoryFormData } from "../components/shared/SubCategoryFormModal";
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
    throw error;
  }
};

export const addSubCategory = async (
  subCategoryData: SubCategoryFormData
): Promise<SubCategory> => {
  try {
    const response = await axiosInstance.post<SubCategory>(
      baseUrl,
      subCategoryData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSubCategory = async (
  subCategoryId: number,
  updatedData: SubCategoryFormData
) => {
  try {
    const response = await axiosInstance.put(
      `${baseUrl}/${subCategoryId}`,
      updatedData
    );

    return response.data; // return only data (best practice)
  } catch (error) {
    console.error("Error updating sub category:", error);
    throw error;
  }
};
