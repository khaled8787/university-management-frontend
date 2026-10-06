"use client";

import { useMutation } from "@tanstack/react-query";

import {
  loginUser,
  registerUser,
  type LoginCredentials,
  type RegisterPayload,
} from "@/services/auth.service";

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      loginUser(credentials),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      registerUser(payload),
  });
}