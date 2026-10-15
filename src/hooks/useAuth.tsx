import { useState } from "react";
import api from "../lib/axios";
import useAuthStore from "../store/authStore";
import type { RegisterFormData } from "../types/outgoing/register-form-data";
import type {
  ValidateSiiRequest,
  ValidateSiiResponseRaw,
} from "../types/auth/validated-sii";
import { normalizeValidateSiiResponse } from "../types/auth/validated-sii";

interface LoginData {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { logout: clearAuth } = useAuthStore();

  const validateSii = async (data: ValidateSiiRequest) => {
    try {
      setLoading(true);
      const response = await api.post<ValidateSiiResponseRaw>(
        "auth/validated-sii",
        { rut: data.rut, password: data.password },
      );
      return normalizeValidateSiiResponse(response.data, data.rut);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData: RegisterFormData) => {
    try {
      setLoading(true);
      const { privacyPolicy, emailConsent, ...rest } = formData;
      const response = await api.post("auth/register", rest);
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

  return {
    validateSii,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    loading,
  };
};
