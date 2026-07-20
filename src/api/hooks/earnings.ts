import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import { qk } from '../keys';
import type { EarningsSummary, Paginated, SaleRecord } from '../../../types';

export function useEarnings() {
  return useQuery({
    queryKey: qk.earnings(),
    queryFn: async () => {
      const { data } = await api.get<EarningsSummary>('/earnings/');
      return data;
    },
  });
}

export function useEarningsHistory() {
  return useQuery({
    queryKey: qk.earningsHistory(),
    queryFn: async () => {
      const { data } = await api.get<Paginated<SaleRecord>>('/earnings/history/');
      return data.results;
    },
  });
}