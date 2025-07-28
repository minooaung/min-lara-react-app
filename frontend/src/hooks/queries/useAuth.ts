import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import { ApiResponse, LoginCredentials, SignupData, User } from "../../types";

interface LoginResponse {
  user: User;
}

export const useLogin = () => {
  const axios = useAxios();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await axios.post<LoginResponse>("/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      dispatch(authActions.settingUser(data.user));
    },
  });
};

export const useSignup = () => {
  const axios = useAxios();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (userData: SignupData) => {
      const { data } = await axios.post<ApiResponse<{ user: User }>>("/signup", userData);
      return data;
    },
    onSuccess: (data) => {
      dispatch(authActions.settingUser(data.data.user));
    },
  });
};

export const useLogout = () => {
  const axios = useAxios();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async () => {
      await axios.post("/logout");
    },
    onSuccess: () => {
      dispatch(authActions.logout());
    },
  });
}; 