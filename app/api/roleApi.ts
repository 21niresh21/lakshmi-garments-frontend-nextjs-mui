import axiosInstance from "../config/axiosConfig";
import { UserParams } from "./_types/UserParams";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/roles";

export const fetchRoles = async () => {
  try {
    const response = await axiosInstance.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};
