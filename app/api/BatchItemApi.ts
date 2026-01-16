import axiosInstance from "../config/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/batch-items";

export const fetchBatchItems = async (
  serialCode: string,
  jobworkType: string
) => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/batch/${serialCode}/${jobworkType}/available-quantity`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching batch items:", error);
    throw error;
  }
};
