import { useQuery } from '@tanstack/react-query';
import { useAxios } from '../useAxios';
import { ApiResponse } from '../../types';

export const useDashboardStats = <T = any>() => {
  const axios = useAxios();

  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<T>>('/dashboard/stats');
      return data.data;
    },
    // Refresh every minute
    refetchInterval: 60 * 1000,
    // Keep data fresh for 30 seconds
    staleTime: 30 * 1000,
    // Refetch on window focus
    refetchOnWindowFocus: true,
    // Refetch on reconnect
    refetchOnReconnect: true,
  });
}; 