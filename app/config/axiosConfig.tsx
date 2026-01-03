import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * Automatically attaches user info to every request
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // 🔹 Example: stored after login
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user?.id) {
      config.headers["X-USER-ID"] = user.id;
    }

    if (user?.role) {
      config.headers["X-USER-ROLE"] = user.role.name;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
