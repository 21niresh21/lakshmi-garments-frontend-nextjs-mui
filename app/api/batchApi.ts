import axiosInstance from "../config/axiosConfig";
import { BatchStatus } from "../_types/BatchStatus";
import { FetchBatchesParams } from "./_types/Batch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/batches";

export const fetchBatches = async (params?: FetchBatchesParams) => {
  try {
    const response = await axiosInstance.get(baseUrl, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching batches:", error);
    throw error;
  }
};

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
        batchStatus: BatchStatus.CREATED,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error getting unfinished urgent batches:", error);
    throw error;
  }
};

export const getUnfinishedBatches = async () => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/available-for-jobwork`);
    return response.data;
  } catch (error) {
    console.error("Error getting unfinished batchs:", error);
    throw error;
  }
};

export const getAllowedJobworkTypes = async (serialCode: string) => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/${serialCode}/jobwork-types`
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error getting possible jobwork types:", error);
    throw error;
  }
};

export const recycleBatch = async (batchId: number) => {
  try {
    const response = await axiosInstance.post(`${baseUrl}/recycle/${batchId}`);
    return response.data;
  } catch (error) {
    console.error("Error recycling batch:", error);
    throw error;
  }
};

export const fetchTimeline = async (batchId: number) => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/timeline/${batchId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching timeline for batch:", error);
    throw error;
  }
};

export const fetchAvailableQuantity = async (
  serialCode: string,
  jobworkType: string
) => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/${serialCode}/${jobworkType}/available-quantity`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching quantity for batch:", error);
    throw error;
  }
};
