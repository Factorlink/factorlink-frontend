import { useState } from "react";
import api from "../lib/axios";
import type { RegisterFormData } from "../types/outgoing/register-form-data";

interface LoginData {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

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

  return {
    register,
    login,
    loading,
  };
};
