import axiosInstance from "../config/axiosConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface LoginResponse {
  data: any;
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axiosInstance.post(`${API_BASE_URL}/login`, {
    username,
    password,
  });
  console.log(response);

  return response.data;
};
