import axiosInstance from "../config/axiosConfig";

export const createStock = async (data: any): Promise<any> => {
  try {
    const response = await axiosInstance.post("/shipments", data);
    console.log("Stock created successfully:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
