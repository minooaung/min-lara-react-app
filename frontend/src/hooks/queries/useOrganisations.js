import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../axios-client';

export const useOrganisations = (page = 1, search = '') => {
  return useQuery({
    queryKey: ['organisations', page, search],
    queryFn: async () => {
      const response = await axiosClient.get(`/organisations?page=${page}&search=${search}`);
      return response.data;
    },
    // Add staleTime to prevent unnecessary refetches
    staleTime: 5000, // Consider data fresh for 5 seconds
  });
};

export const useOrganisation = (id) => {
  return useQuery({
    queryKey: ['organisation', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axiosClient.get(`/organisations/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateOrganisation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosClient.post('/organisations', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Update the organizations list without triggering an immediate refetch
      queryClient.invalidateQueries({
        queryKey: ['organisations'],
        refetchType: 'none'
      });
      
      // Add the new organization to the cache
      queryClient.setQueryData(['organisation', data.id], data);
      
      // Mark dashboard as stale but don't refetch immediately
      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
        refetchType: 'none'
      });
    },
  });
};

export const useUpdateOrganisation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await axiosClient.put(`/organisations/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update the organization in the cache immediately
      queryClient.setQueryData(['organisation', variables.id], data);
      
      // Mark the organizations list as stale but don't refetch immediately
      queryClient.invalidateQueries({
        queryKey: ['organisations'],
        refetchType: 'none'
      });
      
      // Mark dashboard as stale but don't refetch immediately
      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
        refetchType: 'none'
      });
    },
  });
};

export const useDeleteOrganisation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosClient.delete(`/organisations/${id}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate organisations list and dashboard stats
      queryClient.invalidateQueries(['organisations']);
      queryClient.invalidateQueries(['dashboard']);
    },
  });
}; 