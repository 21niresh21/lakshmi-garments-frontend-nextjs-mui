import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080", // API base URL
  headers: {
    "Content-Type": "application/json", // Default content type
  },
});

export default axiosInstance;
