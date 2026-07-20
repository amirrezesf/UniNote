import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import { qk } from '../keys';
import type { Paginated, Purchase, DownloadResponse } from '../../../types';

export function usePurchases() {
  return useQuery({
    queryKey: qk.purchases(),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Purchase>>('/purchases/');
      return data.results;
    },
  });
}

export function usePurchaseDownload(purchaseId: string) {
  return useQuery({
    queryKey: qk.purchase(purchaseId),
    queryFn: async () => {
      const { data } = await api.get<DownloadResponse>(`/purchases/${purchaseId}/download/`);
      return data.fileUrl;
    },
    enabled: !!purchaseId,
  });
}