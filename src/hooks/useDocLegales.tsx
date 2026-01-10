import { useState } from "react";
import api from "../lib/axios";
import type { DocLegales } from "../types/doc-legales";

interface AsociacionPayload {
  empresaId?: string;
  factoringId?: string;
}

export const useDocLegales = () => {
  const [loading, setLoading] = useState(false);

  const createDocLegales = async (data: DocLegales) => {
    setLoading(true);
    try {
      await api.post("/documentos-legales", data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const listDocLegalesEmpresa = async (empresaId: string) => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/documentos-legales?empresaId=${empresaId}`
      );
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
    }
  };

  const listDocLegalesFactoring = async (factoringId: string) => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/documentos-legales?factoringId=${factoringId}`
      );
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
    }
  };

  const findDocLegalById = async (docLegalesId: string) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/documentos-legales/${docLegalesId}`);
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
    }
  };

  const updateEstadoValidacion = async (
    docLegalesId: string,
    estadoValidacion: string
  ) => {
    setLoading(true);
    try {
      await api.put(`/documentos-legales/${docLegalesId}`, {
        estadoValidacion,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const cambiarAsociacion = async (docLegalesId: string, payload: AsociacionPayload) => {
    setLoading(true);
    try {
      await api.put(`/documentos-legales/${docLegalesId}`, payload);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const deleteDocLegales = async (docLegalesId: string) => {
    setLoading(true);
    try {
      await api.delete(`/documentos-legales/${docLegalesId}`);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return {
    loading,
    createDocLegales,
    listDocLegalesEmpresa,
    listDocLegalesFactoring,
    findDocLegalById,
    updateEstadoValidacion,
    cambiarAsociacion,
    deleteDocLegales,
  };
};
