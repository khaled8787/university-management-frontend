
"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "@/lib/api";

/* ---------------------------------------------
   Types
--------------------------------------------- */

export type EnrollmentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type EnrollmentRole = "ADMIN" | "STUDENT";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

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
    fee?: number | string;
  } | null;
}

export interface EnrollmentPayment {
  id: string;
  studentId: string;
  enrollmentId?: string | null;
  amount: number | string;
  currency: string;
  type: string;
  method: string;
  status: PaymentStatus;
  transactionId?: string | null;
  providerSessionId?: string | null;
  paidAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface PaginatedData<T> {
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  data?: T[];
}

export interface UpdateEnrollmentStatusPayload {
  id: string;
  status: EnrollmentStatus;
}

/* ---------------------------------------------
   Response normalizers
--------------------------------------------- */

function normalizeList<T>(
  value: T[] | PaginatedData<T> | undefined,
): T[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    Array.isArray(value.data)
  ) {
    return value.data;
  }

  return [];
}

/* ---------------------------------------------
   Enrollment API
--------------------------------------------- */

async function fetchEnrollments(
  status?: EnrollmentStatus,
  role: EnrollmentRole = "ADMIN",
): Promise<Enrollment[]> {
  const endpoint =
    role === "STUDENT"
      ? "/enrollments/my"
      : "/enrollments";

  const response = await api.get<
    ApiResponse<
      Enrollment[] | PaginatedData<Enrollment>
    >
  >(endpoint, {
    params: {
      ...(role === "ADMIN"
        ? {
            page: 1,
            limit: 10,
          }
        : {}),
      ...(status ? { status } : {}),
    },
  });

  return normalizeList(response.data.data);
}

async function fetchEnrollment(
  id: string,
): Promise<Enrollment> {
  const response = await api.get<
    ApiResponse<Enrollment>
  >(`/enrollments/${id}`);

  if (!response.data.data) {
    throw new Error(
      "Enrollment data was not returned.",
    );
  }

  return response.data.data;
}

async function updateEnrollmentStatus(
  payload: UpdateEnrollmentStatusPayload,
): Promise<ApiResponse<Enrollment>> {
  const response = await api.patch<
    ApiResponse<Enrollment>
  >(`/enrollments/${payload.id}/status`, {
    status: payload.status,
  });

  return response.data;
}

/* ---------------------------------------------
   Payment API
--------------------------------------------- */

async function fetchMyPayments(): Promise<
  EnrollmentPayment[]
> {
  const response = await api.get<
    ApiResponse<
      EnrollmentPayment[] |
      PaginatedData<EnrollmentPayment>
    >
  >("/payments/my");

  return normalizeList(response.data.data);
}

/* ---------------------------------------------
   React Query hooks
--------------------------------------------- */

export function useEnrollments(
  role: EnrollmentRole = "ADMIN",
  status?: EnrollmentStatus,
) {
  return useQuery({
    queryKey: [
      "enrollments",
      role,
      {
        page: 1,
        limit: 10,
        status: status ?? "ALL",
      },
    ],
    queryFn: () => fetchEnrollments(status, role),
  });
}

export function useEnrollment(
  id: string | null,
) {
  return useQuery({
    queryKey: ["enrollment", id],
    queryFn: () => fetchEnrollment(id as string),
    enabled: Boolean(id),
  });
}

export function useMyPayments() {
  return useQuery({
    queryKey: ["payments", "my"],
    queryFn: fetchMyPayments,
    staleTime: 15_000,
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
