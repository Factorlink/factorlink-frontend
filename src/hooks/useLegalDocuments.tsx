import { useState } from "react";
import api from "../lib/axios";

type LegalDocumentPayload = {
  empresaId?: string | null;
  factoringId?: string | null;
  tipo?: string;
  nombreArchivo?: string;
  archivoBase64?: string;
};

type UpdateLegalDocumentPayload = {
  estadoValidacion?: string;
  empresaId?: string | null;
  factoringId?: string | null;
  nombreArchivo?: string;
};

export const useLegalDocuments = () => {
  const [loading, setLoading] = useState(false);

  const createLegalDocument = async (data: LegalDocumentPayload) => {
    try {
      setLoading(true);
      const response = await api.post("documentos-legales", data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getLegalDocumentsByEmpresaId = async (empresaId: string) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/documentos-legales?empresaId=${encodeURIComponent(empresaId)}`
      );
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getLegalDocumentsByFactoringId = async (factoringId: string) => {
    try {
      setLoading(true);
      const response = await api.get(
        `documentos-legales?factoringId=${encodeURIComponent(factoringId)}`
      );
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getLegalDocumentById = async (docId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`documentos-legales/${docId}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateLegalDocument = async (
    docId: string,
    data: UpdateLegalDocumentPayload
  ) => {
    try {
      setLoading(true);
      const response = await api.put(`documentos-legales/${docId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteLegalDocument = async (docId: string) => {
    try {
      setLoading(true);
      const response = await api.delete(`documentos-legales/${docId}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createLegalDocument,
    getLegalDocumentsByEmpresaId,
    getLegalDocumentsByFactoringId,
    getLegalDocumentById,
    updateLegalDocument,
    deleteLegalDocument,
  };
};
