import { useState } from "react";
import api from "../lib/axios";
import type { Empresa } from "../types/empresa";
import type { SiiEmpresa } from "../types/sii";

export const useEmpresa = () => {
  const [loading, setLoading] = useState(false);

  const createEmpresa = async (data: Empresa) => {
    try {
      setLoading(true);
      const response = await api.post("empresas", data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createEmpresaBySii = async (data: SiiEmpresa) => {
    try {
      setLoading(true);
      const response = await api.post("empresas/sync-sii", data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAllEmpresas = async () => {
    try {
      setLoading(true);
      const response = await api.get("empresas");
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getEmpresaById = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get(`empresas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateEmpresa = async (id: string, data: Empresa) => {
    try {
      setLoading(true);
      const response = await api.put(`empresas/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmpresa = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.delete(`empresas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, createEmpresa, getAllEmpresas, getEmpresaById, updateEmpresa, deleteEmpresa, createEmpresaBySii };
};
