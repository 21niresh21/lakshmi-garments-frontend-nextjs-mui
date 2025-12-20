import { TransportFormData } from "../components/shared/TransportFormModal";
import axiosInstance from "../config/axiosConfig";
import { TransportParams } from "./_types/TransportParams";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/transports";

export const addTransport = async (transportData: TransportFormData) => {
  try {
    const response = await axiosInstance.post(baseUrl, transportData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchTransports = async (params?: TransportParams) => {
  try {
    const response = await axiosInstance.get(baseUrl, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transports:", error);
    throw error;
  }
};

export const updateTransport = async (
  transportId: number,
  updatedData: TransportFormData
) => {
  try {
    const response = await axiosInstance.put(
      `${baseUrl}/${transportId}`,
      updatedData
    );

    return response.data; // return only data (best practice)
  } catch (error) {
    console.error("Error updating transport:", error);
    throw error;
  }
};
