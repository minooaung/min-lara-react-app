import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import store from "./store";
import { authActions } from "./store/auth";

// Extend ImportMeta interface to include env
declare global {
  interface ImportMetaEnv {
    VITE_API_BASE_URL: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

interface ErrorResponse {
  error?: string;
}

const axiosClient: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: true, // Send cookies automatically
});

// Fetch CSRF cookie when app starts
const initializeCsrfToken = async (): Promise<void> => {
  try {
    await axiosClient.get("/sanctum/csrf-cookie");
    console.log("CSRF cookie set.");
  } catch (error) {
    console.error("Failed to retrieve CSRF token:", error);
  }
};

// Helper to read cookies from document.cookie
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const newConfig = { ...config };
  newConfig.headers = newConfig.headers || {};
  newConfig.headers["Content-Type"] = "application/json";

  // ✅ Attach CSRF token from cookie (for Sanctum)
  const xsrfToken = getCookie("XSRF-TOKEN");
  if (xsrfToken) {
    newConfig.headers["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
  }

  return newConfig;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    try {
      const response = error.response;

      if (response?.status === 401) {
        console.log("Authentication failed:", response.data?.error);

        // Prevent logout & redirection on failed login attempt
        if (window.location.pathname === "/login") {
          return Promise.reject(error); // Just show the error, don't log out
        }

        // Logout only if session has expired (user is already logged in)
        store.dispatch(authActions.logout());
        window.location.href = "/login"; // Redirect only if session expired
      }

      return Promise.reject(error); // Ensure error is passed to .catch()
    } catch (e) {
      console.error(e);
    }

    throw error;
  }
);

// Call CSRF initialization when app starts
initializeCsrfToken();

export default axiosClient; 