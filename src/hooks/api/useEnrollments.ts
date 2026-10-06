"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "@/lib/api";

export type EnrollmentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  createdAt?: string;
  updatedAt?: string;

  student?: {
    id?: string;
    name?: string;
    email?: string;
    studentId?: string;
    user?: {
      id?: string;
      name?: string;
      email?: string;
    };
  } | null;

  course?: {
    id?: string;
    code?: string;
    title?: string;
    name?: string;
    credit?: number;
    semester?: number;
  } | null;
}

interface EnrollmentsResponse {
  success: boolean;
  message?: string;
  data?: {
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };
    data?: Enrollment[];
  };
}

interface EnrollmentResponse {
  success: boolean;
  message?: string;
  data?: Enrollment;
}

export interface UpdateEnrollmentStatusPayload {
  id: string;
  status: EnrollmentStatus;
}

async function fetchEnrollments(
  status?: EnrollmentStatus,
): Promise<Enrollment[]> {
  const response =
    await api.get<EnrollmentsResponse>("/enrollments", {
      params: {
        page: 1,
        limit: 10,
        ...(status ? { status } : {}),
      },
    });

  return response.data.data?.data ?? [];
}

async function fetchEnrollment(
  id: string,
): Promise<Enrollment> {
  const response =
    await api.get<EnrollmentResponse>(
      `/enrollments/${id}`,
    );

  if (!response.data.data) {
    throw new Error(
      "Enrollment data was not returned.",
    );
  }

  return response.data.data;
}

async function updateEnrollmentStatus(
  payload: UpdateEnrollmentStatusPayload,
): Promise<EnrollmentResponse> {
  const response =
    await api.patch<EnrollmentResponse>(
      `/enrollments/${payload.id}/status`,
      {
        status: payload.status,
      },
    );

  return response.data;
}

export function useEnrollments(
  status?: EnrollmentStatus,
) {
  return useQuery({
    queryKey: [
      "enrollments",
      {
        page: 1,
        limit: 10,
        status: status ?? "ALL",
      },
    ],
    queryFn: () => fetchEnrollments(status),
  });
}

export function useEnrollment(
  id: string | null,
) {
  return useQuery({
    queryKey: ["enrollment", id],
    queryFn: () =>
      fetchEnrollment(id as string),
    enabled: Boolean(id),
  });
}

export function useUpdateEnrollmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEnrollmentStatus,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["enrollments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["enrollment", variables.id],
      });
    },
  });
}