import { UserCreateRequest, UserListItem } from "../_types/User";
import axiosInstance from "../config/axiosConfig";
import { UserParams } from "./_types/UserParams";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const baseUrl = API_BASE_URL + "/users";

export type UserPayload = Omit<UserListItem, "id">;

export const fetchUsers = async (params?: UserParams) => {
  try {
    const response = await axiosInstance.get(baseUrl, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateUser = async (
  userId: number,
  userUpdateRequest: UserPayload
) => {
  try {
    const response = await axiosInstance.put(
      `${baseUrl}/${userId}`,
      userUpdateRequest
    );
    return response;
  } catch (error) {
    console.error("error updating user", error);
    throw error;
  }
};

export const createUser = async (userCreateRequest: UserPayload) => {
  try {
    const response = await axiosInstance.post(baseUrl, userCreateRequest);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const fetchUserByUsername = async (username: string) => {
  try {
    const response = await axiosInstance.get(`${baseUrl}/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw error;
  }
};

export const changePassword = async (username: string, changePasswordRequest: any) => {
  try {
    const response = await axiosInstance.patch(`${baseUrl}/${username}/change-password`, changePasswordRequest);
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};
