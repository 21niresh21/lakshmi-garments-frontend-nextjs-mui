import { Employee } from "../_types/Employee";
import axiosInstance from "../config/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/employees";

export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await axiosInstance.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const fetchEmployeeStats = async (empId: number) => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/stats/${empId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee stats:", error);
    throw error;
  }
};
