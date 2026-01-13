import { useState } from "react";
import api from "../lib/axios";

interface UpdateUserProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  direccion?: string;
  cargo?: string;
  fechaNacimiento?: string;
  preferenciaContacto?: string;
}

export const useUser = () => {
  const [loading, setLoading] = useState(false);
  
  const updateUserProfile = async (data: UpdateUserProfileData) => {
    try {
      setLoading(true);
      const response = await api.put("users/profile", data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    try {
      setLoading(true);
      const response = await api.put("users/change-password", data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUserProfile,
    changePassword,
    loading,
  };
};
