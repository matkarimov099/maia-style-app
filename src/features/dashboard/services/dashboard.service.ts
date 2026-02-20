import type { DashboardStats } from '@/features/dashboard/types';
import axiosClient from '@/plugins/axios';

const DASHBOARD_ENDPOINTS = {
  stats: '/dashboard/stats',
} as const;

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await axiosClient.get<DashboardStats>(DASHBOARD_ENDPOINTS.stats);
    return data;
  },
};
