import axios from "axios";

import store from "./store/index";
import { authActions } from "./store/auth";
import { notiActions } from "./store/notification";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: true, // Send cookies automatically
});

axiosClient.interceptors.request.use((config) => {
  // Not using token as automatically sending cookies
  // const token = localStorage.getItem("ACCESS_TOKEN");
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }

  config.headers["Content-Type"] = "application/json";

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    try {
      const { response } = error;

      if (response.status === 401) {
        // Not using token as automatically sending cookies
        // localStorage.removeItem("ACCESS_TOKEN");

        // Session expired or user is not authenticated
        console.log("Session expired. Logging out...");

        // Dispatch Redux logout action
        store.dispatch(authActions.logout());
        store.dispatch(
          notiActions.settingNotiMessage(
            "Session expired. Please log in again."
          )
        );

        //window.location.href = "/login"; // Redirect to login
      }
    } catch (e) {
      console.error(e);
    }

    throw error;
  }
);

export default axiosClient;
