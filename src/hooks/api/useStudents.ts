"use client";

import { useQuery } from "@tanstack/react-query";

import { api, getApiErrorMessage } from "@/lib/api";

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  batch?: string;
  departmentId?: string;
}

interface StudentsResponse {
  success: boolean;
  message?: string;
  data?: {
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
    };
    data?: Student[];
  };
}

async function fetchStudents(): Promise<Student[]> {
  try {
    const response = await api.get<StudentsResponse>("/students", {
      params: {
        page: 1,
        limit: 10,
      },
    });

    return response.data.data?.data ?? [];
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to load students."),
    );
  }
}

export function useStudents() {
  return useQuery({
    queryKey: ["students", { page: 1, limit: 10 }],
    queryFn: fetchStudents,
  });
}