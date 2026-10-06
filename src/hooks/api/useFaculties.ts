"use client";

import { useQuery } from "@tanstack/react-query";

import { api, getApiErrorMessage } from "@/lib/api";

export interface Faculty {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  designation?: string;
  departmentId?: string;
}

interface FacultiesResponse {
  success: boolean;
  message?: string;
  data?: {
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
    };
    data?: Faculty[];
  };
}

async function fetchFaculties(): Promise<Faculty[]> {
  try {
    const response = await api.get<FacultiesResponse>("/faculties", {
      params: {
        page: 1,
        limit: 10,
      },
    });

    return response.data.data?.data ?? [];
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to load faculty."),
    );
  }
}

export function useFaculties() {
  return useQuery({
    queryKey: ["faculties", { page: 1, limit: 10 }],
    queryFn: fetchFaculties,
  });
}