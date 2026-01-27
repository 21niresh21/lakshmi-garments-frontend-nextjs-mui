import { Employee } from "../_types/Employee";
import axiosInstance from "../config/axiosConfig";
import { EmployeeParams } from "./_types/EmployeeParams";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/employees";

export const fetchEmployees = async (
  params?: EmployeeParams
): Promise<any> => {
  try {
    const response = await axiosInstance.get(`${baseUrl}`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const createEmployee = async (data: any): Promise<Employee[]> => {
  try {
    const response = await axiosInstance.post(`${baseUrl}`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

export const updateEmployee = async (
  id: number,
  data: any
): Promise<Employee[]> => {
  try {
    const response = await axiosInstance.put(`${baseUrl}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating employee:", error);
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
