import axios from "axios";
import useAuthStore from "../store/authStore";

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
  (error) => {
    const isLoginRequest = error.config?.url?.includes("auth/login");
    
    if (error.response?.status === 401 && !isLoginRequest) {
      // Limpiar estado de autenticación solo si NO es una petición de login
      useAuthStore.getState().setAccessToken("");
      useAuthStore.getState().setRefreshToken("");
      useAuthStore.getState().setUser(null);
      
      // Redirigir a login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
