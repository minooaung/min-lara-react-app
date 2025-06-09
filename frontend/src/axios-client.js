import axios from "axios";

import store from "./store/index";
import { authActions } from "./store/auth";
import { notiActions } from "./store/notification";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: true, // Send cookies automatically
});

// Helper to read cookies from document.cookie
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

axiosClient.interceptors.request.use((config) => {
  config.headers["Content-Type"] = "application/json";

  // ✅ Attach CSRF token from cookie (for Sanctum)
  const xsrfToken = getCookie("XSRF-TOKEN");
  if (xsrfToken) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
  }

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
        // Session expired or user is not authenticated
        console.log("Session Expired. Logging out...");

        // Dispatch Redux logout action
        store.dispatch(authActions.logout());

        // store.dispatch(
        //   notiActions.settingNotiMessage(
        //     "Session expired. Please log in again."
        //   )
        // );

        window.location.href = "/login"; // Redirect to login
      }
    } catch (e) {
      console.error(e);
    }

    throw error;
  }
);

export default axiosClient;
