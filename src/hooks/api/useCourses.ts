"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "@/lib/api";

export interface Course {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  credit: number;
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
  departmentId: string;
  facultyId: string;
  semester: number;
  capacity: number;
}

export interface UpdateCoursePayload {
  id: string;
  title: string;
  capacity: number;
}

export interface UpdateCourseStatusPayload {
  id: string;
  isActive: boolean;
}

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
  const response = await api.get<CourseResponse>(
    `/courses/${id}`,
  );

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
  const response = await api.patch<CourseResponse>(
    `/courses/${payload.id}`,
    {
      title: payload.title,
      capacity: payload.capacity,
    },
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

export function useCourses() {
  return useQuery({
    queryKey: ["courses", { page: 1, limit: 10 }],
    queryFn: fetchCourses,
  });
}

export function useCourse(id: string | null) {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourse(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourse,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCourse,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["course", variables.id],
      });
    },
  });
}

export function useUpdateCourseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCourseStatus,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["course", variables.id],
      });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourse,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      queryClient.removeQueries({
        queryKey: ["course", id],
      });
    },
  });
}