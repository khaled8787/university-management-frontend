"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "@/lib/api";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED";

export type PaymentType =
  | "COURSE_FEE"
  | "TUITION_FEE"
  | "EXAM_FEE"
  | "OTHER";

export type PaymentMethod =
  | "STRIPE";

export interface Payment {
  id: string;
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

interface PaymentsResponse {
  success: boolean;
  message?: string;

  data?: {
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };

    data?: Payment[];
  };
}

interface PaymentResponse {
  success: boolean;
  message?: string;
  data?: Payment;
}

interface StripeCheckoutResponse {
  success: boolean;
  message?: string;

  data?: {
    payment?: Payment;

    checkout?: {
      sessionId?: string;
      checkoutUrl?: string | null;
      status?: string | null;
    };
  };
}

export interface CreatePaymentPayload {
  amount: number;
  currency: string;
  type: PaymentType;
  method: PaymentMethod;
}

async function fetchMyPayments(): Promise<Payment[]> {
  const response =
    await api.get<PaymentsResponse>(
      "/payments/my",
      {
        params: {
          page: 1,
          limit: 10,
        },
      },
    );

  return response.data.data?.data ?? [];
}

async function fetchMyPayment(
  paymentId: string,
): Promise<Payment> {
  const response =
    await api.get<PaymentResponse>(
      `/payments/my/${paymentId}`,
    );

  if (!response.data.data) {
    throw new Error(
      "Payment data was not returned.",
    );
  }

  return response.data.data;
}

async function createPayment(
  payload: CreatePaymentPayload,
): Promise<PaymentResponse> {
  const response =
    await api.post<PaymentResponse>(
      "/payments",
      payload,
    );

  return response.data;
}

async function createStripeCheckout(
  paymentId: string,
): Promise<StripeCheckoutResponse> {
  const response =
    await api.post<StripeCheckoutResponse>(
      `/payments/${paymentId}/stripe-checkout`,
    );

  return response.data;
}

async function cancelPayment(
  paymentId: string,
): Promise<PaymentResponse> {
  const response =
    await api.patch<PaymentResponse>(
      `/payments/${paymentId}/cancel`,
    );

  return response.data;
}

export function useMyPayments() {
  return useQuery({
    queryKey: [
      "my-payments",
      {
        page: 1,
        limit: 10,
      },
    ],

    queryFn: fetchMyPayments,
  });
}

export function useMyPayment(
  paymentId: string | null,
) {
  return useQuery({
    queryKey: [
      "my-payment",
      paymentId,
    ],

    queryFn: () =>
      fetchMyPayment(
        paymentId as string,
      ),

    enabled: Boolean(paymentId),
  });
}

export function useCreatePayment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createPayment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-payments"],
      });
    },
  });
}

export function useCreateStripeCheckout() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createStripeCheckout,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-payments"],
      });
    },
  });
}

export function useCancelPayment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: cancelPayment,

    onSuccess: (_, paymentId) => {
      queryClient.invalidateQueries({
        queryKey: ["my-payments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-payment", paymentId],
      });
    },
  });
}