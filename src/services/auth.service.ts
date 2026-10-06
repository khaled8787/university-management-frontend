import { api } from "@/lib/api";
import type { AuthUser } from "@/lib/auth";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type StudentRegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: "STUDENT";
  studentId: string;
  batch: string;
  departmentId: string;
};

export type FacultyRegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: "FACULTY";
  employeeId: string;
  designation: string;
  departmentId: string;
};

export type RegisterPayload =
  | StudentRegisterPayload
  | FacultyRegisterPayload;

export type LoginResponse = {
  success?: boolean;
  message?: string;
  data?: {
    user?: AuthUser;
    accessToken?: string;
    refreshToken?: string;
  };
};

export type RegisterResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

export async function loginUser(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    credentials,
  );

  return response.data;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>(
    "/auth/register",
    payload,
  );

  return response.data;
}