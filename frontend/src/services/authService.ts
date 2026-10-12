import api from './api';
import type { AuthResponse, LoginPayload, SignupPayload } from '../types/website';

export interface SignupResponse {
  success: boolean;
  message: string;
  user: { id: string; name: string; username: string; email: string };
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  resetToken?: string;
}

export interface SimpleSuccessResponse {
  success: boolean;
  message: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },

  async signup(payload: SignupPayload): Promise<SignupResponse> {
    const { data } = await api.post<SignupResponse>('/auth/signup', payload);
    return data;
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const { data } = await api.post<ForgotPasswordResponse>(
      '/auth/forgot-password',
      { email },
    );
    return data;
  },

  async resetPassword(
    token: string,
    password: string,
  ): Promise<SimpleSuccessResponse> {
    const { data } = await api.post<SimpleSuccessResponse>(
      `/auth/reset-password/${token}`,
      { password },
    );
    return data;
  },
};
