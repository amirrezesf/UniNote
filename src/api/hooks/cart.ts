import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../client';
import { qk } from '../keys';
import type { Cart, AddToCartRequest, CheckoutResponse, VerifyResponse } from '../../../types';

export function useCart() {
  return useQuery({
    queryKey: qk.cart(),
    queryFn: async () => {
      const { data } = await api.get<Cart>('/cart/');
      return data;
    },
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: AddToCartRequest) => {
      const { data } = await api.post<Cart>('/cart/items/', body);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.cart() });
    },
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: number) => {
      await api.delete(`/cart/items/${itemId}/`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.cart() });
    },
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.delete('/cart/');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.cart() });
    },
  });
}

export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<CheckoutResponse>('/checkout/');
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.cart() });
      qc.invalidateQueries({ queryKey: qk.purchases() });
    },
  });
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: async (params: { Authority: string; Status: string }) => {
      const { data } = await api.get<VerifyResponse>('/checkout/verify/', { params });
      return data;
    },
  });
}

// Preview / Validation (premium flow)
import type { PreviewResponse, ValidateRequest, ValidateResponse } from '../../../types';

export function usePreview(materialId: string) {
  return useQuery({
    queryKey: qk.preview(materialId),
    queryFn: async () => {
      const { data } = await api.get<PreviewResponse>(`/materials/${materialId}/preview/`);
      return data;
    },
    enabled: !!materialId,
  });
}

export function useValidate(materialId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: ValidateRequest) => {
      const { data } = await api.post<ValidateResponse>(`/materials/${materialId}/validate/`, body);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.preview(materialId) });
      qc.invalidateQueries({ queryKey: qk.material(materialId) });
    },
  });
}