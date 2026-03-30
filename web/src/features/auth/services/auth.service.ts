import { api } from '@/services/api';
import type { AuthTokens, User } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<{ user: User; tokens: AuthTokens }>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    api.post<{ user: User; tokens: AuthTokens }>('/auth/register', payload),

  forgotPassword: (email: string) =>
    api.post<void>('/auth/forgot-password', { email }),

  me: () => api.get<User>('/auth/me'),

  logout: () => api.post<void>('/auth/logout'),
};
