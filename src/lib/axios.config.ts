// ✅ src/api/customAxios.ts
import axios, { AxiosRequestConfig } from "axios";

// Đây là hàm mutator đúng chuẩn
export const customAxios = <T = unknown>(
  config: AxiosRequestConfig
): Promise<T> => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030"
  });
  
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken"); // or from Redux, Zustand...
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance.request<T>(config).then((res) => res.data);
};
