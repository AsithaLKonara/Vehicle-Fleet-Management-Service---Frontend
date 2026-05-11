import apiClient from '../lib/apiClient';

export interface DashboardStats {
  totalUsers: number;
  totalVehicles: number;
  activeAssignments: number;
  statusDistribution: {
    status: string;
    count: number;
  }[];
}

export const getStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get('/dashboard/stats');
  return response.data.data;
};
