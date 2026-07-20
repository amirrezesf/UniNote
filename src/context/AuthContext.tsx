import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLogin, useRegister, useLogout, useMe, useUpdateProfile } from '../api/auth';
import { queryClient } from '../api/queryClient';
import { tokenStore } from '../api/tokenStore';
import type { User } from '../../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { email: string; name: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (input: { name?: string; fieldOfStudy?: string; university?: string; avatar?: File | string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const updateProfileMutation = useUpdateProfile();

  // Hydrate token store on mount
  useEffect(() => {
    tokenStore.hydrate();
  }, []);

  // Fetch user if we have a token
  const { data: user, isLoading, isError } = useMe();

  // If query fails (e.g., token expired), clear tokens
  useEffect(() => {
    if (isError) {
      tokenStore.clear();
      qc.clear();
    }
  }, [isError]);

  const login = async (credentials: { email: string; password: string }) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (userData: { email: string; name: string; password: string }) => {
    await registerMutation.mutateAsync(userData);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const updateProfile = async (input: { name?: string; fieldOfStudy?: string; university?: string; avatar?: File | string }) => {
    await updateProfileMutation.mutateAsync(input);
  };

  return (
    <AuthContext.Provider value={{
      user: user ?? null,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}