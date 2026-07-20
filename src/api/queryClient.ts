import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // directory data is fairly static
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});