"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api, getApiErrorMessage } from "@/lib/api";

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  batch?: string;
  departmentId?: string;
  phone?: string;
  address?: string;
}

interface StudentsResponse {
  success: boolean;
  message?: string;
  data?: {
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };
    data?: Student[];
  };
}

interface StudentResponse {
  success: boolean;
  message?: string;
  data?: Student;
}

export interface UpdateStudentPayload {
  id: string;
  phone: string;
  address: string;
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

async function fetchStudent(id: string): Promise<Student> {
  try {
    const response = await api.get<StudentResponse>(
      `/students/${id}`,
    );

    if (!response.data.data) {
      throw new Error("Student data was not returned.");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to load student."),
    );
  }
}

async function updateStudent(
  payload: UpdateStudentPayload,
): Promise<StudentResponse> {
  try {
    const response = await api.patch<StudentResponse>(
      `/students/${payload.id}`,
      {
        phone: payload.phone,
        address: payload.address,
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to update student."),
    );
  }
}

async function deleteStudent(id: string): Promise<void> {
  try {
    await api.delete(`/students/${id}`);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to delete student."),
    );
  }
}

export function useStudents() {
  return useQuery({
    queryKey: ["students", { page: 1, limit: 10 }],
    queryFn: fetchStudents,
  });
}

export function useStudent(id: string | null) {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => fetchStudent(id as string),
    enabled: Boolean(id),
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudent,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["students"],
      });

      queryClient.invalidateQueries({
        queryKey: ["student", variables.id],
      });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudent,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["students"],
      });

      queryClient.removeQueries({
        queryKey: ["student", id],
      });
    },
  });
}