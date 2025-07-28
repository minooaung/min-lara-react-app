import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface UseAxiosReturn {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
} 