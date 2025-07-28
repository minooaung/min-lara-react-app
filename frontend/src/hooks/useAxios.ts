import { AxiosError, AxiosRequestConfig } from 'axios';
import axiosClient from "../axios-client";
import { handleApiError } from "../utils/apiErrorHandler";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import { UseAxiosReturn } from './types';

interface ApiErrorResponse {
  error?: string;
  details?: Record<string, string[]>;
}

export const useAxios = (): UseAxiosReturn => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleError = (error: AxiosError<ApiErrorResponse>) => {
    const formattedError = handleApiError(error);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Don't logout on login page
      if (window.location.pathname !== "/login") {
        dispatch(authActions.logout());
        navigate("/login");
      }
    }
    
    return Promise.reject(formattedError);
  };

  return {
    get: <T = any>(url: string, config?: AxiosRequestConfig) => 
      axiosClient.get<T>(url, config).catch(handleError as (error: AxiosError<unknown>) => never),
    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
      axiosClient.post<T>(url, data, config).catch(handleError as (error: AxiosError<unknown>) => never),
    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
      axiosClient.put<T>(url, data, config).catch(handleError as (error: AxiosError<unknown>) => never),
    delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
      axiosClient.delete<T>(url, config).catch(handleError as (error: AxiosError<unknown>) => never),
  };
}; 