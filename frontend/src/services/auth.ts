import type { AuthUser } from "../interfaces/auth";
import { apiRequest } from "./client"; 
import { z } from "zod";

// Validation schemas
const SigninPayloadSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

const SignupPayloadSchema = z.object({
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type SigninPayload = z.infer<typeof SigninPayloadSchema>;
export type SignupPayload = z.infer<typeof SignupPayloadSchema>;

// Response types phải khớp với backend
export interface AuthResponse {
  message: string;
  data?: {
    accessToken?: string; 
    user?: AuthUser;
    id?: string;
    email?: string;
    fullName?: string;
  };
}

export interface UserProfileResponse {
  success: boolean;
  user: AuthUser;
}

// Auth functions
export async function signin(
  credentials: SigninPayload
): Promise<AuthResponse> {
  // Validate trước khi gửi
  SigninPayloadSchema.parse(credentials);
  
  // Backend endpoint là /auth/login, không phải /users/login
  const response = await apiRequest<AuthResponse>(
    "post",
    "/auth/login",
    credentials
  );
  
  // Lưu token vào localStorage
  if (response.data && response.data.accessToken) {
    localStorage.setItem("token", response.data.accessToken);
  }
  
  return response;
}

export async function signup(
  credentials: SignupPayload
): Promise<AuthResponse> {
  // Validate trước khi gửi
  SignupPayloadSchema.parse(credentials);
  
  const response = await apiRequest<AuthResponse>(
    "post",
    "/auth/register",
    credentials
  );
  
  // Lưu token vào localStorage
  if (response.data && response.data.accessToken) {
    localStorage.setItem("token", response.data.accessToken);
  }
  
  return response;
}

export async function signout(): Promise<void> {
  await apiRequest<void>("post", "/auth/logout", {});
  
  // Xóa token khỏi localStorage
  localStorage.removeItem("token");
}

export async function getProfile(): Promise<UserProfileResponse> {
  return apiRequest<UserProfileResponse>("get", "/auth/me");
}

// Helper functions
export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}