"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "@/lib/api";

export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE";

export interface Attendance {
  id: string;
  studentId: string;
  courseId: string;
  facultyId: string;
  date: string;
  status: AttendanceStatus;
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
  } | null;

  faculty?: {
    id?: string;
    name?: string;
    email?: string;
    employeeId?: string;
  } | null;
}

interface AttendancesResponse {
  success: boolean;
  message?: string;
  data?: {
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };
    data?: Attendance[];
  };
}

interface AttendanceResponse {
  success: boolean;
  message?: string;
  data?: Attendance;
}

export interface CreateAttendancePayload {
  studentId: string;
  courseId: string;
  facultyId: string;
  date: string;
  status: AttendanceStatus;
  remarks: string;
}

export interface UpdateAttendancePayload {
  id: string;
  status: AttendanceStatus;
  remarks: string;
}

async function fetchAttendances(
  status?: AttendanceStatus,
): Promise<Attendance[]> {
  const response =
    await api.get<AttendancesResponse>("/attendances", {
      params: {
        page: 1,
        limit: 10,
        ...(status ? { status } : {}),
      },
    });

  return response.data.data?.data ?? [];
}

async function fetchMyAttendance(): Promise<Attendance[]> {
  const response =
    await api.get<AttendancesResponse>(
      "/attendances/my",
      {
        params: {
          page: 1,
          limit: 10,
        },
      },
    );

  return response.data.data?.data ?? [];
}

async function fetchAttendance(
  id: string,
): Promise<Attendance> {
  const response =
    await api.get<AttendanceResponse>(
      `/attendances/${id}`,
    );

  if (!response.data.data) {
    throw new Error(
      "Attendance data was not returned.",
    );
  }

  return response.data.data;
}

async function createAttendance(
  payload: CreateAttendancePayload,
): Promise<AttendanceResponse> {
  const response =
    await api.post<AttendanceResponse>(
      "/attendances",
      payload,
    );

  return response.data;
}

async function updateAttendance(
  payload: UpdateAttendancePayload,
): Promise<AttendanceResponse> {
  const response =
    await api.patch<AttendanceResponse>(
      `/attendances/${payload.id}`,
      {
        status: payload.status,
        remarks: payload.remarks,
      },
    );

  return response.data;
}

async function deleteAttendance(
  id: string,
): Promise<void> {
  await api.delete(`/attendances/${id}`);
}

export function useAttendances(
  status?: AttendanceStatus,
) {
  return useQuery({
    queryKey: [
      "attendances",
      {
        page: 1,
        limit: 10,
        status: status ?? "ALL",
      },
    ],
    queryFn: () => fetchAttendances(status),
  });
}

export function useMyAttendance() {
  return useQuery({
    queryKey: [
      "my-attendance",
      {
        page: 1,
        limit: 10,
      },
    ],
    queryFn: fetchMyAttendance,
  });
}

export function useAttendance(
  id: string | null,
) {
  return useQuery({
    queryKey: ["attendance", id],
    queryFn: () =>
      fetchAttendance(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAttendance,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendances"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-attendance"],
      });
    },
  });
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAttendance,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendances"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-attendance"],
      });

      queryClient.invalidateQueries({
        queryKey: ["attendance", variables.id],
      });
    },
  });
}

export function useDeleteAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAttendance,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["attendances"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-attendance"],
      });

      queryClient.removeQueries({
        queryKey: ["attendance", id],
      });
    },
  });
}