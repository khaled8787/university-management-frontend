"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export interface Department {
  id: string;
  name: string;
  code: string;
}

interface DepartmentsResponse {
  success: boolean;
  message?: string;
  data: Department[];
}

async function fetchDepartments(): Promise<Department[]> {
  const response =
    await api.get<DepartmentsResponse>("/departments");

  return response.data.data;
}

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });
}