import { FieldErrors } from "./errors";
import { Role } from "./Role";

// 1. The Core User (Shared properties)
export interface BaseUser {
  id: number;
  username: string;
}

// 2. The one from your Login API (Matches your Context/LocalStorage)
export interface AuthUser extends BaseUser {
  roles: string[];
}

// 3. The one from your userService.getPaginatedUsers (Spring Boot DTO)
export interface UserListItem extends BaseUser {
  isActive: boolean;
  firstName: string;
  lastName: string;
  roleName: string;
  password?: string;
}

export interface UserCreateRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  isActive: boolean;
  roleName: string;
}

export type UserErrors = FieldErrors<UserListItem>;

export const INITIAL_USER: UserListItem = {
  id: 0,
  username: "",
  firstName: "",
  lastName: "",
  roleName: "",
  isActive: true,
  password : ""
};
