import axiosInstance from "../config/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface LoginResponse {
  data: any;
}

export const login = async (
  username: string,
  password: string
): Promise<any> => {
  const response = await axiosInstance.post(`${API_BASE_URL}/api/auth/login`, {
    username,
    password,
  });
  return response.data;
};
