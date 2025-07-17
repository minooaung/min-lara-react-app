import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import { useDispatch } from "react-redux";
import { notiActions } from "../../store/notification";

// Query keys
export const organisationKeys = {
  all: ["organisations"],
  lists: () => [...organisationKeys.all, "list"],
  list: (filters) => [...organisationKeys.lists(), { filters }],
  details: () => [...organisationKeys.all, "detail"],
  detail: (id) => [...organisationKeys.details(), id],
};

export const useOrganisations = (page = 1, search = "") => {
  const axios = useAxios();
  
  return useQuery({
    queryKey: organisationKeys.list({ page, search }),
    queryFn: () => axios.get("/organisations", { params: { page, search } })
      .then(response => response.data),
  });
};

export const useOrganisation = (id) => {
  const axios = useAxios();
  
  return useQuery({
    queryKey: organisationKeys.detail(id),
    queryFn: () => axios.get(`/organisations/${id}`).then(response => response.data),
    enabled: !!id, // Only run if id is provided
    staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
    refetchOnMount: 'always' // This ensures one fetch on mount
  });
};

export const useCreateOrganisation = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: (orgData) => axios.post("/organisations", orgData)
      .then(response => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organisationKeys.lists() });
      dispatch(notiActions.settingNotiMessage("Organisation created successfully"));
      setTimeout(() => dispatch(notiActions.settingNotiMessage(null)), 3000);
    },
  });
};

export const useUpdateOrganisation = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: ({ id, ...orgData }) => axios.put(`/organisations/${id}`, orgData)
      .then(response => response.data),
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific organisation detail
      queryClient.invalidateQueries({ queryKey: organisationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: organisationKeys.detail(variables.id) });
      
      // Remove the specific organisation from cache to force a fresh fetch
      queryClient.removeQueries({ queryKey: organisationKeys.detail(variables.id) });
      
      dispatch(notiActions.settingNotiMessage("Organisation updated successfully"));
      setTimeout(() => dispatch(notiActions.settingNotiMessage(null)), 3000);
    },
  });
};

export const useDeleteOrganisation = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: (id) => axios.delete(`/organisations/${id}`)
      .then(response => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organisationKeys.lists() });
      dispatch(notiActions.settingNotiMessage("Organisation was successfully deleted"));
      setTimeout(() => dispatch(notiActions.settingNotiMessage(null)), 3000);
    },
  });
}; 