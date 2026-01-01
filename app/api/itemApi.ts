import { Item } from "../_types/Item";
import { ItemFormData } from "../components/shared/ItemFormModal";
import axiosInstance from "../config/axiosConfig";
import { ItemParams } from "./_types/ItemParams";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/items";

export const addItem = async (itemData: ItemFormData): Promise<Item> => {
  try {
    const response = await axiosInstance.post(baseUrl, itemData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchItems = async (params?: ItemParams) => {
  try {
    const response = await axiosInstance.get(baseUrl, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const updateItem = async (itemId: number, updatedData: ItemFormData) => {
  try {
    const response = await axiosInstance.put(
      `${baseUrl}/${itemId}`,
      updatedData
    );

    return response.data; // return only data (best practice)
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};
