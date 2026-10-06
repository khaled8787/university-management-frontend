"use client";

import { useQuery } from "@tanstack/react-query";

import { api, getApiErrorMessage } from "@/lib/api";

export interface Course {
  id: string;
  code: string;
  title: string;
  description?: string;
  credit: number;
  departmentId: string;
  facultyId: string;
  semester: number;
  capacity: number;
  isActive?: boolean;
}

interface CoursesResponse {
  success: boolean;
  message?: string;
  data?: {
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
    };
    data?: Course[];
  };
}

async function fetchCourses(): Promise<Course[]> {
  try {
    const response = await api.get<CoursesResponse>("/courses", {
      params: {
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    });

    return response.data.data?.data ?? [];
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to load courses."),
    );
  }
}

export function useCourses() {
  return useQuery({
    queryKey: [
      "courses",
      {
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    ],
    queryFn: fetchCourses,
  });
}