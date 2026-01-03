import axiosInstance from "../config/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/generate-excel";

export const generateMaterialLedgerExcel = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/material-ledger`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error generating material ledger excel:", error);
    throw error;
  }
};
