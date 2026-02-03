import axiosInstance from "../config/axiosConfig";

/**
 * Fetches dashboard statistics and visualization data for a specific date range.
 * 
 * @param startDate - Format: YYYY-MM-DD
 * @param endDate - Format: YYYY-MM-DD
 */
export const fetchDashboardData = async (startDate: string, endDate: string) => {
    try {
        const response = await axiosInstance.get('/dashboard', {
            params: {
                startDate,
                endDate
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard:", error);
        throw error;
    }
};
