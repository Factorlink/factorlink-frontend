import { useState } from "react";
import api from "../lib/axios";
import type { User } from "../types/user";

export const useUsers = () => {
  const [loading, setLoading] = useState(false);

  const getAllUsers = async (): Promise<User[]> => {
    setLoading(true);
    try {
      const response = await api.get("users");
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUsersByEmpresaId = async (empresaId: string): Promise<User[]> => {
    setLoading(true);
    try {
      const response = await api.get(`users/by-empresa/${empresaId}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getAllUsers,
    getUsersByEmpresaId,
  };
};

