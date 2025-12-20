import axiosInstance from "../config/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/jobworks";

export const fetchJobworks = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`${baseUrl}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching jobworks:", error);
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
