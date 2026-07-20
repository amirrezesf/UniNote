import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
import { qk } from './keys';
import type { User, LoginRequest, RegisterRequest, AuthResponse, UpdateProfileInput } from '../../types';
import { tokenStore } from './tokenStore';
import { getApiErrorMessage } from './client';

const LOGIN_URL = '/auth/login/';
const REGISTER_URL = '/auth/register/';
const ME_URL = '/auth/me/';
const LOGOUT_URL = '/auth/logout/';
const PASSWORD_RESET_URL = '/auth/password-reset/';
const PASSWORD_RESET_CONFIRM_URL = '/auth/password-reset/confirm/';
const REFRESH_URL = '/auth/refresh/';

// --- Auth Hooks ---

export function useLogin() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const { data } = await api.post<AuthResponse>(LOGIN_URL, credentials);
      return data;
    },
    onSuccess: (data) => {
      tokenStore.set({ access: data.access, refresh: data.refresh });
      qc.setQueryData(qk.me(), data.user);
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const { data } = await api.post<AuthResponse>(REGISTER_URL, userData);
      return data;
    },
    onSuccess: (data) => {
      tokenStore.set({ access: data.access, refresh: data.refresh });
      qc.setQueryData(qk.me(), data.user);
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refresh = tokenStore.refresh;
      if (refresh) {
        try {
          await api.post(LOGOUT_URL, { refresh });
        } catch {
          // Ignore logout errors
        }
      }
    },
    onSuccess: () => {
      tokenStore.clear();
      qc.clear();
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: qk.me(),
    queryFn: async () => {
      const { data } = await api.get<User>(ME_URL);
      return data;
    },
    enabled: !!tokenStore.access,
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch another user's public profile via /auth/users/<id>/.
// Used by ProfilePage when viewing someone other than the current user
// (e.g., clicking a material's uploader name -> /profile/<uploaderId>).
export function useUser(id?: string) {
  return useQuery({
    queryKey: qk.user(id ?? ''),
    queryFn: async () => {
      const { data } = await api.get<User>(`/auth/users/${id}/`);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      if (input.avatar instanceof File) {
        const formData = new FormData();
        Object.entries(input).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value as string | Blob);
          }
        });
        const { data } = await api.patch<User>(ME_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
      }
      const { data } = await api.patch<User>(ME_URL, input);
      return data;
    },
    onSuccess: (data) => {
      qc.setQueryData(qk.me(), data);
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}

export function usePasswordReset() {
  return useMutation({
    mutationFn: async (email: string) => {
      await api.post(PASSWORD_RESET_URL, { email });
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}

export function usePasswordResetConfirm() {
  return useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      await api.post(PASSWORD_RESET_CONFIRM_URL, { token, password });
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}