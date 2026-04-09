import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@store/useAuthStore";
import logger from "@utils/logger";

/**
 * Centralized HTTP Client
 * SECURITY NOTE: SSL Pinning is kept conceptual for this preview to allow 
 * network inspection. In production, pinning is enforced here.
 */
export const apiClient = axios.create({
  baseURL: "https://api.sohcahtoa.io/v1",
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = "Bearer " + token;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { refreshToken, refreshSession, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        return Promise.reject(
          new Error("No refresh token available. Session expired."),
        );
      }

      logger.info(
        "[Axios Interceptor] Token expired. Attempting silent refresh...",
      );

      const newAccessToken = await refreshSession();

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = "Bearer " + newAccessToken;
      return apiClient(originalRequest);
    } catch (refreshError) {
      logger.error(
        "[Axios Interceptor] Token refresh failed permanently.",
        refreshError,
      );
      processQueue(refreshError, null);

      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);