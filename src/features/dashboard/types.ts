export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  newOrders: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}
