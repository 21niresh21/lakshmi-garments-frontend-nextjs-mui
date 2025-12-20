import { SupplierFormData } from "../components/shared/SupplierFormModal";
import axiosInstance from "../config/axiosConfig";
import { SupplierParams } from "./_types/SupplierParams";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/suppliers";

export const addSupplier = async (supplierData: SupplierFormData) => {
  try {
    const response = await axiosInstance.post(baseUrl, supplierData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchSuppliers = async (params?: SupplierParams) => {
  try {
    const response = await axiosInstance.get(baseUrl, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};

export const updateSupplier = async (
  supplierId: number,
  updatedData: SupplierFormData
) => {
  try {
    const response = await axiosInstance.put(
      `${baseUrl}/${supplierId}`,
      updatedData
    );

    return response.data; // return only data (best practice)
  } catch (error) {
    console.error("Error updating supplier:", error);
    throw error;
  }
};
