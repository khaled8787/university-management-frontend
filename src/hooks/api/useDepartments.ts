"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api, getApiErrorMessage } from "@/lib/api";

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  deletedAt?: string | null;
}

interface DepartmentsResponse {
  success: boolean;
  message?: string;
  data: Department[];
}

interface DepartmentResponse {
  success: boolean;
  message?: string;
  data?: Department;
}

export interface CreateDepartmentPayload {
  name: string;
  code: string;
  description: string;
}

export interface UpdateDepartmentPayload {
  id: string;
  description: string;
}

async function fetchDepartments(): Promise<Department[]> {
  const response = await api.get<{
    success: boolean;
    message?: string;
    data: {
      meta?: {
        page?: number;
        limit?: number;
        total?: number;
      };
      data: Department[];
    };
  }>("/departments");

  console.log("DEPARTMENTS API RESPONSE:", response.data);

  return response.data.data.data;
}

async function createDepartment(
  payload: CreateDepartmentPayload,
): Promise<DepartmentResponse> {
  try {
    const response =
      await api.post<DepartmentResponse>(
        "/departments",
        payload,
      );

    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Failed to create department.",
      ),
    );
  }
}

async function updateDepartment(
  payload: UpdateDepartmentPayload,
): Promise<DepartmentResponse> {
  try {
    const response =
      await api.patch<DepartmentResponse>(
        `/departments/${payload.id}`,
        {
          description: payload.description,
        },
      );

    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Failed to update department.",
      ),
    );
  }
}

async function deleteDepartment(
  id: string,
): Promise<void> {
  try {
    await api.delete(`/departments/${id}`);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Failed to delete department.",
      ),
    );
  }
}

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
    },
  });
}