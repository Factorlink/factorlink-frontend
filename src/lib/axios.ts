import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import useAuthStore from "../store/authStore";

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else if (token) {
      request.resolve(token);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token a cada request
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas 401 (token expirado)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // URLs que no deben intentar refresh
    const excludedUrls = [
      "auth/login",
      "auth/register",
      "auth/forgot-password",
      "auth/reset-password",
      "auth/refresh-token",
      "users/change-password",
    ];
    
    const isExcludedRequest = excludedUrls.some((url) => 
      originalRequest?.url?.includes(url)
    );
    
    // Si es 401 y no es una request excluida y no se ha reintentado
    if (error.response?.status === 401 && !isExcludedRequest && !originalRequest._retry) {
      const refreshToken = useAuthStore.getState().refreshToken;
      
      // Si no hay refresh token, hacer logout directamente
      if (!refreshToken) {
        performLogout();
        return Promise.reject(error);
      }
      
      // Si ya estamos refrescando, encolar esta request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err: unknown) => {
              reject(err);
            },
          });
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Intentar renovar el token
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}auth/refresh-token`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );
        
        const newAccessToken = response.data?.accessToken;
        const newRefreshToken = response.data?.refreshToken;
        
        if (newAccessToken) {
          // Actualizar tokens en el store
          useAuthStore.getState().setAccessToken(newAccessToken);
          if (newRefreshToken) {
            useAuthStore.getState().setRefreshToken(newRefreshToken);
          }
          
          // Procesar requests en cola con el nuevo token
          processQueue(null, newAccessToken);
          
          // Reintentar la request original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } else {
          throw new Error("No access token in refresh response");
        }
      } catch (refreshError) {
        // El refresh falló, hacer logout
        processQueue(refreshError, null);
        performLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

// Función helper para hacer logout
const performLogout = () => {
  useAuthStore.getState().setAccessToken("");
  useAuthStore.getState().setRefreshToken("");
  useAuthStore.getState().setUser(null);
  useAuthStore.getState().setCurrentRole(null);
  
  // Solo redirigir si no estamos ya en login
  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }
};

export default api;
