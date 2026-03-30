import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService, type LoginPayload, type RegisterPayload } from '../services/auth.service';
import { useAuthStore } from '@/store/authStore';

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: ({ data }) => {
      setUser(data.user, data.tokens.accessToken, data.tokens.refreshToken);
      navigate('/mis-listas', { replace: true });
    },
  });
}

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: ({ data }) => {
      setUser(data.user, data.tokens.accessToken, data.tokens.refreshToken);
      navigate('/mis-listas', { replace: true });
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
}
