"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api, getApiErrorMessage } from "@/lib/api";

export interface Faculty {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  designation: string;
  specialization?: string;
  departmentId: string;
}

interface FacultiesResponse {
  success: boolean;
  message?: string;
  data?: {
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };
    data?: Faculty[];
  };
}

interface FacultyResponse {
  success: boolean;
  message?: string;
  data?: Faculty;
}

export interface UpdateFacultyPayload {
  id: string;
  designation: string;
  specialization: string;
}

async function fetchFaculties(): Promise<Faculty[]> {
  try {
    const response = await api.get<FacultiesResponse>(
      "/faculties",
      {
        params: {
          page: 1,
          limit: 10,
        },
      },
    );

    return response.data.data?.data ?? [];
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Failed to load faculty members.",
      ),
    );
  }
}

async function fetchFaculty(
  id: string,
): Promise<Faculty> {
  try {
    const response = await api.get<FacultyResponse>(
      `/faculties/${id}`,
    );

    if (!response.data.data) {
      throw new Error(
        "Faculty data was not returned.",
      );
    }

    return response.data.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Failed to load faculty member.",
      ),
    );
  }
}

async function updateFaculty(
  payload: UpdateFacultyPayload,
): Promise<FacultyResponse> {
  try {
    const response =
      await api.patch<FacultyResponse>(
        `/faculties/${payload.id}`,
        {
          designation: payload.designation,
          specialization: payload.specialization,
        },
      );

    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Failed to update faculty member.",
      ),
    );
  }
}

async function deleteFaculty(
  id: string,
): Promise<void> {
  try {
    await api.delete(`/faculties/${id}`);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Failed to delete faculty member.",
      ),
    );
  }
}

export function useFaculties() {
  return useQuery({
    queryKey: [
      "faculties",
      {
        page: 1,
        limit: 10,
      },
    ],
    queryFn: fetchFaculties,
  });
}

export function useFaculty(
  id: string | null,
) {
  return useQuery({
    queryKey: ["faculty", id],
    queryFn: () =>
      fetchFaculty(id as string),
    enabled: Boolean(id),
  });
}

export function useUpdateFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFaculty,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["faculties"],
      });

      queryClient.invalidateQueries({
        queryKey: ["faculty", variables.id],
      });
    },
  });
}

export function useDeleteFaculty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFaculty,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["faculties"],
      });

      queryClient.removeQueries({
        queryKey: ["faculty", id],
      });
    },
  });
}