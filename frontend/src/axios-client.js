import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: true, // ✅ Send cookies automatically
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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
        localStorage.removeItem("ACCESS_TOKEN");
        //window.location.href = "/login"; // Redirect to login
      }
    } catch (e) {
      console.error(e);
    }

    throw error;
  }
);

export default axiosClient;
