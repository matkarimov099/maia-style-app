import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { dashboardService } from '@/features/dashboard/services/dashboard.service';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
};

export function useDashboardStats() {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => dashboardService.getStats(),
  });

  return useMemo(
    () => ({
      stats: data ?? null,
      isLoading,
      isFetching,
      error,
    }),
    [data, isLoading, isFetching, error]
  );
}
