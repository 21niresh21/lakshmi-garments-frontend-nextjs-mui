import axiosInstance from "../config/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/id";


export const fetchNextSerialCode = async (categoryName: string): Promise<string> => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/batch?categoryName=${categoryName}`
    );
    return response.data;
  } catch (error) {
    throw error
  }
};