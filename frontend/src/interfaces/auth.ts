export type UserRole = 'student' | 'teacher' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: {
    id?: string;
    name: string;
    permissions: string[];
  } | null;
}

export interface AuthResponse {
  message: string;
  data?: {
    accessToken?: string;
    user?: AuthUser;
  };
}

export interface UserProfileResponse {
  success: boolean;
  user: AuthUser;
}
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  errors?: string[];
}