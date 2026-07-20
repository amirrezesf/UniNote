import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getApiErrorMessage } from '../client';
import { qk } from '../keys';
import type { LibraryItem, LibraryToggleResponse } from '../../../types';
import type { Paginated } from '../../../types';

export function useLibrary() {
  return useQuery({
    queryKey: qk.library(),
    queryFn: async () => {
      const { data } = await api.get<Paginated<LibraryItem>>('/library/');
      return data.results;
    },
  });
}

export function useAddToLibrary() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (materialId: string) => {
      const { data } = await api.post<LibraryItem>('/library/items/', { materialId });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.library() });
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}

export function useRemoveFromLibrary() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (materialId: string) => {
      await api.delete(`/library/items/${materialId}/`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.library() });
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}

export function useToggleLibrary() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (materialId: string) => {
      const { data } = await api.post<LibraryToggleResponse>('/library/toggle/', { materialId });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.library() });
    },
    onError: (error) => {
      throw new Error(getApiErrorMessage(error));
    },
  });
}
