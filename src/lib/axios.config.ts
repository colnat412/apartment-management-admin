import axios, { AxiosRequestConfig } from "axios";

import { LocalStorageHelper } from "./local-storage/local-storage";
import { LocalStorageKeys } from "./local-storage/local-storage-key";

export const customAxios = <T = unknown>(
  config: AxiosRequestConfig
): Promise<T> => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030"
  });

  instance.interceptors.request.use((config) => {
    const token = LocalStorageHelper.get<string>(LocalStorageKeys.ACCESS_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  return instance.request<T>(config).then((res) => res.data);
};
