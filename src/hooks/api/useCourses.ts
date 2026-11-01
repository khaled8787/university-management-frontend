"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "@/lib/api";

// --------------------------------------------------
// Types
// --------------------------------------------------

/**
 * Prisma Decimal values may arrive from the API as
 * either numbers or strings, depending on serialization.
 */
export type CourseFee = number | string;

export interface Course {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  credit: number;
  fee: CourseFee;
  departmentId: string;
  facultyId: string;
  semester: number;
  capacity: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;

  department?: {
    id: string;
    name: string;
  } | null;

  faculty?: {
    id: string;
    name: string;
    employeeId?: string;
    designation?: string;
  } | null;
}

interface CoursesResponse {
  success: boolean;
  message?: string;
  data?: {
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };
    data?: Course[];
  };
}

interface CourseResponse {
  success: boolean;
  message?: string;
  data?: Course;
}

export interface CreateCoursePayload {
  code: string;
  title: string;
  description: string;
  credit: number;
  fee: number;
  departmentId: string;
  facultyId: string;
  semester: number;
  capacity: number;
}

export interface UpdateCoursePayload {
  id: string;
  title?: string;
  capacity?: number;
  fee?: number;
}

export interface UpdateCourseStatusPayload {
  id: string;
  isActive: boolean;
}

// --------------------------------------------------
// API functions
// --------------------------------------------------

async function fetchCourses(): Promise<Course[]> {
  const response = await api.get<CoursesResponse>("/courses", {
    params: {
      page: 1,
      limit: 10,
    },
  });

  return response.data.data?.data ?? [];
}

async function fetchCourse(id: string): Promise<Course> {
  const response = await api.get<CourseResponse>(`/courses/${id}`);

  if (!response.data.data) {
    throw new Error("Course data was not returned.");
  }

  return response.data.data;
}

async function createCourse(
  payload: CreateCoursePayload,
): Promise<CourseResponse> {
  const response = await api.post<CourseResponse>(
    "/courses",
    payload,
  );

  return response.data;
}

async function updateCourse(
  payload: UpdateCoursePayload,
): Promise<CourseResponse> {
  const { id, ...updateData } = payload;

  const response = await api.patch<CourseResponse>(
    `/courses/${id}`,
    updateData,
  );

  return response.data;
}

async function updateCourseStatus(
  payload: UpdateCourseStatusPayload,
): Promise<CourseResponse> {
  const response = await api.patch<CourseResponse>(
    `/courses/${payload.id}/status`,
    {
      isActive: payload.isActive,
    },
  );

  return response.data;
}

async function deleteCourse(id: string): Promise<void> {
  await api.delete(`/courses/${id}`);
}

// --------------------------------------------------
// React Query hooks
// --------------------------------------------------

export function useCourses() {
  return useQuery({
    queryKey: ["courses", { page: 1, limit: 10 }],
    queryFn: fetchCourses,
  });
}

export function useCourse(id: string | null) {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourse(id!),
    enabled: Boolean(id),
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourse,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCourse,

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["courses"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["course", variables.id],
        }),
      ]);
    },
  });
}

export function useUpdateCourseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCourseStatus,

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["courses"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["course", variables.id],
        }),
      ]);
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourse,

    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["courses"],
        }),
        queryClient.removeQueries({
          queryKey: ["course", id],
        }),
      ]);
    },
  });
}
