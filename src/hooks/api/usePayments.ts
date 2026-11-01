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

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentType =
  | "COURSE_FEE"
  | "TUITION_FEE"
  | "EXAM_FEE"
  | "OTHER";

export type PaymentMethod = "STRIPE";

export interface Payment {
  id: string;
  studentId?: string;
  enrollmentId?: string | null;

  amount: number | string;
  currency: string;
  type: PaymentType;
  method: PaymentMethod;
  status: PaymentStatus;

  transactionId?: string | null;
  providerSessionId?: string | null;
  paidAt?: string | null;
  failureReason?: string | null;

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

type ListResponse<T> =
  | T[]
  | PaginatedData<T>;

export interface CreatePaymentPayload {
  amount: number;
  currency: string;
  type: PaymentType;
  method: PaymentMethod;
}

export interface StripeCheckoutData {
  payment?: Payment;
  checkout?: {
    sessionId?: string;
    checkoutUrl?: string | null;
    status?: string | null;
  };
}

interface StripeCheckoutResponse {
  success: boolean;
  message?: string;
  data?: StripeCheckoutData;
}

/* ---------------------------------------------
   Helpers
--------------------------------------------- */

function normalizeList<T>(
  value: ListResponse<T> | undefined,
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
   Student Payment API
--------------------------------------------- */

async function fetchMyPayments(): Promise<Payment[]> {
  const response = await api.get<
    ApiResponse<ListResponse<Payment>>
  >("/payments/my", {
    params: {
      page: 1,
      limit: 100,
    },
  });

  return normalizeList(response.data.data);
}

async function fetchMyPayment(
  paymentId: string,
): Promise<Payment> {
  const response = await api.get<
    ApiResponse<Payment>
  >(`/payments/my/${paymentId}`);

  if (!response.data.data) {
    throw new Error("Payment data was not returned.");
  }

  return response.data.data;
}

async function createPayment(
  payload: CreatePaymentPayload,
): Promise<ApiResponse<Payment>> {
  const response = await api.post<
    ApiResponse<Payment>
  >("/payments", payload);

  return response.data;
}

async function createStripeCheckout(
  paymentId: string,
): Promise<StripeCheckoutResponse> {
  const response = await api.post<
    StripeCheckoutResponse
  >(`/payments/${encodeURIComponent(paymentId)}/stripe-checkout`);

  return response.data;
}

async function cancelPayment(
  paymentId: string,
): Promise<ApiResponse<Payment>> {
  const response = await api.patch<
    ApiResponse<Payment>
  >(`/payments/${encodeURIComponent(paymentId)}/cancel`);

  return response.data;
}

/* ---------------------------------------------
   Student Hooks
--------------------------------------------- */

export function useMyPayments() {
  return useQuery({
    queryKey: ["my-payments"],
    queryFn: fetchMyPayments,
    staleTime: 10_000,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
}

export function useMyPayment(
  paymentId: string | null,
) {
  return useQuery({
    queryKey: ["my-payment", paymentId],
    queryFn: () => fetchMyPayment(paymentId!),
    enabled: Boolean(paymentId),
    refetchInterval: (query) =>
      query.state.data?.status === "PENDING"
        ? 5_000
        : false,
    refetchOnWindowFocus: true,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["my-payments"],
      });
    },
  });
}

export function useCreateStripeCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStripeCheckout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["my-payments"],
      });
    },
  });
}

export function useCancelPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelPayment,
    onSuccess: async (_, paymentId) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["my-payments"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["my-payment", paymentId],
        }),
      ]);
    },
  });
}

/* ---------------------------------------------
   Admin Payment Types
--------------------------------------------- */

export interface AdminPayment extends Payment {
  metadata?: Record<string, unknown> | null;

  student?: {
    id?: string;
    studentId?: string;
    user?: {
      id?: string;
      name?: string;
      email?: string;
    } | null;
  } | null;
}

export interface AdminPaymentFilters {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  type?: PaymentType;
  method?: PaymentMethod;
  studentId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UpdatePaymentStatusPayload {
  id: string;
  status: PaymentStatus;
}

interface AdminPaymentsResponse {
  success: boolean;
  message?: string;
  data?: PaginatedData<AdminPayment> | AdminPayment[];
}

async function fetchAdminPayments(
  filters: AdminPaymentFilters = {},
): Promise<{
  meta?: PaginatedData<AdminPayment>["meta"];
  data: AdminPayment[];
}> {
  const response = await api.get<AdminPaymentsResponse>(
    "/payments",
    {
      params: {
        page: filters.page ?? 1,
        limit: filters.limit ?? 10,
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.method ? { method: filters.method } : {}),
        ...(filters.studentId
          ? { studentId: filters.studentId }
          : {}),
        sortBy: filters.sortBy ?? "createdAt",
        sortOrder: filters.sortOrder ?? "desc",
      },
    },
  );

  const result = response.data.data;

  if (Array.isArray(result)) {
    return { data: result };
  }

  return {
    meta: result?.meta,
    data: result?.data ?? [],
  };
}

async function fetchAdminPayment(
  paymentId: string,
): Promise<AdminPayment> {
  const response = await api.get<
    ApiResponse<AdminPayment>
  >(`/payments/admin/${paymentId}`);

  if (!response.data.data) {
    throw new Error("Payment data was not returned.");
  }

  return response.data.data;
}

async function updatePaymentStatus(
  payload: UpdatePaymentStatusPayload,
): Promise<ApiResponse<AdminPayment>> {
  const response = await api.patch<
    ApiResponse<AdminPayment>
  >(`/payments/${payload.id}/status`, {
    status: payload.status,
  });

  return response.data;
}

/* ---------------------------------------------
   Admin Hooks
--------------------------------------------- */

export function useAdminPayments(
  filters: AdminPaymentFilters = {},
) {
  return useQuery({
    queryKey: [
      "admin-payments",
      {
        page: filters.page ?? 1,
        limit: filters.limit ?? 10,
        status: filters.status ?? "ALL",
        type: filters.type ?? "ALL",
        method: filters.method ?? "ALL",
        studentId: filters.studentId ?? "",
        sortBy: filters.sortBy ?? "createdAt",
        sortOrder: filters.sortOrder ?? "desc",
      },
    ],
    queryFn: () => fetchAdminPayments(filters),
  });
}

export function useAdminPayment(
  paymentId: string | null,
) {
  return useQuery({
    queryKey: ["admin-payment", paymentId],
    queryFn: () => fetchAdminPayment(paymentId!),
    enabled: Boolean(paymentId),
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePaymentStatus,
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin-payments"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["admin-payment", variables.id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["my-payments"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["my-payment", variables.id],
        }),
      ]);
    },
  });
}
