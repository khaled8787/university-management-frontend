"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "@/lib/api";

export type ResultGrade =
  | "A_PLUS"
  | "A"
  | "A_MINUS"
  | "B_PLUS"
  | "B"
  | "B_MINUS"
  | "C_PLUS"
  | "C"
  | "D"
  | "F";

export interface Result {
  id: string;

  studentId: string;
  courseId: string;
  facultyId: string;

  marks: number;
  grade: ResultGrade;
  gradePoint: number;
  remarks?: string | null;

  createdAt?: string;
  updatedAt?: string;

  student?: {
    id?: string;
    name?: string;
    email?: string;
    studentId?: string;
  } | null;

  course?: {
    id?: string;
    code?: string;
    title?: string;
    name?: string;
    credit?: number;
  } | null;

  faculty?: {
    id?: string;
    name?: string;
    email?: string;
    employeeId?: string;
  } | null;
}

interface ResultsResponse {
  success: boolean;
  message?: string;
  data?: {
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };
    data?: Result[];
  };
}

interface ResultResponse {
  success: boolean;
  message?: string;
  data?: Result;
}

export interface CreateResultPayload {
  studentId: string;
  courseId: string;
  facultyId: string;
  marks: number;
  grade: ResultGrade;
  gradePoint: number;
  remarks: string;
}

export interface UpdateResultPayload {
  id: string;
  marks: number;
  grade: ResultGrade;
  gradePoint: number;
}

async function fetchResults(
  grade?: ResultGrade,
): Promise<Result[]> {
  const response =
    await api.get<ResultsResponse>(
      "/results",
      {
        params: {
          page: 1,
          limit: 10,
          ...(grade ? { grade } : {}),
        },
      },
    );

  return response.data.data?.data ?? [];
}

async function fetchMyResults(): Promise<Result[]> {
  const response =
    await api.get<ResultsResponse>(
      "/results/my",
      {
        params: {
          page: 1,
          limit: 10,
        },
      },
    );

  return response.data.data?.data ?? [];
}

async function fetchResult(
  id: string,
): Promise<Result> {
  const response =
    await api.get<ResultResponse>(
      `/results/${id}`,
    );

  if (!response.data.data) {
    throw new Error(
      "Result data was not returned.",
    );
  }

  return response.data.data;
}

async function createResult(
  payload: CreateResultPayload,
): Promise<ResultResponse> {
  const response =
    await api.post<ResultResponse>(
      "/results",
      payload,
    );

  return response.data;
}

async function updateResult(
  payload: UpdateResultPayload,
): Promise<ResultResponse> {
  const response =
    await api.patch<ResultResponse>(
      `/results/${payload.id}`,
      {
        marks: payload.marks,
        grade: payload.grade,
        gradePoint: payload.gradePoint,
      },
    );

  return response.data;
}

async function deleteResult(
  id: string,
): Promise<void> {
  await api.delete(`/results/${id}`);
}

export function useResults(
  grade?: ResultGrade,
) {
  return useQuery({
    queryKey: [
      "results",
      {
        page: 1,
        limit: 10,
        grade: grade ?? "ALL",
      },
    ],
    queryFn: () => fetchResults(grade),
  });
}

export function useMyResults() {
  return useQuery({
    queryKey: [
      "my-results",
      {
        page: 1,
        limit: 10,
      },
    ],
    queryFn: fetchMyResults,
  });
}

export function useResult(
  id: string | null,
) {
  return useQuery({
    queryKey: ["result", id],
    queryFn: () =>
      fetchResult(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createResult,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["results"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-results"],
      });
    },
  });
}

export function useUpdateResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateResult,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["results"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-results"],
      });

      queryClient.invalidateQueries({
        queryKey: ["result", variables.id],
      });
    },
  });
}

export function useDeleteResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResult,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["results"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-results"],
      });

      queryClient.removeQueries({
        queryKey: ["result", id],
      });
    },
  });
}