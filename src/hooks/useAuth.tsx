import { useState } from "react";
import api from "../lib/axios";
import useAuthStore from "../store/authStore";
import type { RegisterFormData } from "../types/outgoing/register-form-data";

interface LoginData {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { logout: clearAuth } = useAuthStore();

  const register = async (formData: RegisterFormData) => {
    try {
      setLoading(true);
      const response = await api.post("auth/register", formData);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      const response = await api.post("auth/login", data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.post("auth/logout");
    } finally {
      clearAuth();
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      const response = await api.post("auth/forgot-password", { email });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.post("auth/reset-password", { token, newPassword: password });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async (refreshToken: string) => {
    try {
      setLoading(true);
      const response = await api.post("auth/refresh-token", { refreshToken });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get("auth/check-status");
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    refreshToken,
    checkStatus,
    loading,
  };
};
