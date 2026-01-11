import axiosInstance from "../config/axiosConfig";
import { WorkflowRequestParams } from "./_types/WorkflowRequestParams";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/workflow-requests";

export const createWorflowRequest = async (data: any) => {
  try {
    const response = await axiosInstance.post(baseUrl, data);
    return response.data;
  } catch (error) {
    console.error("Error creating workflow request:", error);
    throw error;
  }
};

export const fetchWorkflowRequests = async (params?: WorkflowRequestParams) => {
  try {
    const response = await axiosInstance.get(baseUrl, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }
};

export const updateWorkflowRequests = async (id: number, data: any) => {
  try {
    const response = await axiosInstance.put(`${baseUrl}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating request:", error);
    throw error;
  }
};

export const fetchWorkflowRequest = async (id: number) => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching request:", error);
    throw error;
  }
};
