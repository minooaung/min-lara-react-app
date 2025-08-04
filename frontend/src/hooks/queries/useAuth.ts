import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import { AuthResponseBase, LoginCredentials, SignupData } from "../../types";

export const useLogin = () => {
  const axios = useAxios();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await axios.post<AuthResponseBase>(
        "/login",
        credentials
      );
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
      const { data } = await axios.post<AuthResponseBase>("/signup", userData);
      return data;
    },
    onSuccess: (data) => {
      console.log("Signup successful:", data.user);
      dispatch(authActions.settingUser(data.user));
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
