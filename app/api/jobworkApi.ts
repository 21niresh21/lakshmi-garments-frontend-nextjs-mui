import axiosInstance from "../config/axiosConfig";
import { JobworkParams } from "./_types/JobworkParams";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/jobworks";

export const fetchJobworks = async (params?: JobworkParams): Promise<any> => {
  try {
    const response = await axiosInstance.get(`${baseUrl}`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching jobworks:", error);
    throw error;
  }
};

export const fetchJobworkDetail = async (
  jobworkNumber: string
): Promise<any> => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/jobwork-numbers/${jobworkNumber}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching jobwork detail:", error);
    throw error;
  }
};

export const createJobwork = async (data: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`${baseUrl}`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating jobwork:", error);
    throw error;
  }
};

export const fetchUnfinishedJobworks = async (
  employeeName: string,
  jobworkNumber: string
): Promise<string[]> => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/unfinished`, {
      params: {
        employeeName,
        jobworkNumber,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching unfinished jobworks:", error);
    throw error;
  }
};

export const fetchNextJobworkNumber = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/jobwork-numbers/next-number`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching next jobwork number:", error);
    throw error;
  }
};

export const reAssignJobwork = async (data: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      `${baseUrl}/reassign/${data.jobworkNumber}`,
      data.employeeId
    );
    return response.data;
  } catch (error) {
    console.error("Error re assigning jobwork:", error);
    throw error;
  }
};
