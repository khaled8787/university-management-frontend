import axios from "axios";

import {
  getAccessToken,
  logout,
} from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn(
    "NEXT_PUBLIC_API_URL is not configured.",
  );
}

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const pathname =
        typeof window !== "undefined"
          ? window.location.pathname
          : "";

      // Public pages should never be redirected to login
      if (pathname === "/login" || pathname === "/register") {
        return Promise.reject(error);
      }

      const accessToken = getAccessToken();

      // Only redirect when an authenticated session exists
      if (accessToken) {
        logout();

        if (typeof window !== "undefined") {
          const redirect = encodeURIComponent(pathname);

          window.location.href = `/login?redirect=${redirect}`;
        }
      }
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong.",
) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}