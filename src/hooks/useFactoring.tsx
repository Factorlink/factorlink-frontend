import { useState } from "react";
import api from "../lib/axios";
import type { Factoring } from "../types/factoring";

export const useFactoring = () => {
  const [loading, setLoading] = useState(false);

  const createFactoring = async (data: Factoring) => {
    try {
      setLoading(true);
      const response = await api.post("factorings", data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAllFactorings = async () => {
    try {
      setLoading(true);
      const response = await api.get("factorings");
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getFactoringById = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get(`factorings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateFactoring = async (id: string, data: Factoring) => {
    try {
      setLoading(true);
      const response = await api.put(`factorings/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteFactoring = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.delete(`factorings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createFactoring,
    getAllFactorings,
    getFactoringById,
    updateFactoring,
    deleteFactoring,
  };
};
