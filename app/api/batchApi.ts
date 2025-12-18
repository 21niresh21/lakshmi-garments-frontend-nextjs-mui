import axiosInstance from "../config/axiosConfig";
import { BatchStatus } from "../_types/BatchStatus";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/batches";

export const createBatch = async (batchDetails: any) => {
  try {
    const response = await axiosInstance.post(baseUrl, batchDetails);
    return response.data;
  } catch (error) {
    console.error("Error creating batch:", error);
    throw error;
  }
};

export const getUnfinishedUrgentBatches = async () => {
  try {
    const response = await axiosInstance.get(baseUrl, {
      params: {
        isUrgent: true,
        batchStatusNames: [BatchStatus.CREATED],
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error getting unfinished urgent batches:", error);
  }
};

export const getUnfinishedBatches = async () => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/pending`);
    return response.data;
  } catch (error) {
    console.error("Error getting unfinished batchs:", error);
  }
};

export const getJobworkTypes = async (serialCode: string) => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/jobwork-types/${serialCode}`
    );
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error getting possible jobwork types:", error);
    throw error;
  }
};
