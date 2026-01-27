import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// Helper to get cookie value by name
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // 1. Get the token from the cookie we set during login
    const token = getCookie("token");

    // 2. Attach it to the Authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Create a simplified error object
      const appError = {
        status,
        message: data.message || "An unexpected error occurred",
        errorCode: data.errorCode || "UNKNOWN_ERROR",
        validationErrors: data.validationErrors || null,
      };

      // You could also trigger global notifications here if desired
      return Promise.reject(appError);
    }
    
    // Technical errors (network, etc)
    return Promise.reject({
      status: 500,
      message: error.message || "Network Error",
      errorCode: "NETWORK_ERROR"
    });
  }
);

export default axiosInstance;
