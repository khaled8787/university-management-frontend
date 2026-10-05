export type UserRole = "ADMIN" | "FACULTY" | "STUDENT";

export interface AuthUser {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
}

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const AUTH_USER_KEY = "authUser";
const AUTH_COOKIE_KEY = "nexus_access_token";

export function setAuthSession(
  accessToken: string,
  refreshToken: string,
  user: AuthUser,
) {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

  const secure =
    window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${AUTH_COOKIE_KEY}=${encodeURIComponent(
    accessToken,
  )}; Path=/; Max-Age=86400; SameSite=Lax${secure}`;
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;

  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;

  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const rawUser = sessionStorage.getItem(AUTH_USER_KEY);

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getAccessToken() && getAuthUser());
}

export function hasRole(...roles: UserRole[]) {
  const user = getAuthUser();

  if (!user) return false;

  return roles.includes(user.role);
}

export function logout() {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);

  document.cookie = `${AUTH_COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getDashboardPath(role: UserRole) {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";

    case "FACULTY":
      return "/faculty/dashboard";

    case "STUDENT":
      return "/student/dashboard";
  }
}