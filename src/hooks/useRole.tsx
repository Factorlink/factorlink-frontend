import { useState } from "react";
import api from "../lib/axios";
import { ROLES } from "../utils/consts";

type FactoringRole =
  | typeof ROLES.FACTORING_ADMIN
  | typeof ROLES.FACTORING_ANALISTA;

type EmpresaRole = typeof ROLES.EMPRESA_ADMIN | typeof ROLES.EMPRESA_USUARIO;

interface FactoringPayload {
  email: string;
  role: FactoringRole;
  factoringId: string;
}

interface EmpresaPayload {
  email: string;
  role: EmpresaRole;
  empresaId: string;
}

export const useRole = () => {
  const [loading, setLoading] = useState(false);

  const assignToFactoring = async (data: FactoringPayload) => {
    setLoading(true);
    try {
      const response = await api.post("users/assign", data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const assignToEmpresa = async (data: EmpresaPayload) => {
    setLoading(true);
    try {
      const response = await api.post("users/assign", data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const unassignToFactoring = async (data: FactoringPayload) => {
    setLoading(true);
    try {
      const response = await api.post("users/unassign", data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const unassignToEmpresa = async (data: EmpresaPayload) => {
    setLoading(true);
    try {
      const response = await api.post("users/unassign", data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    assignToFactoring,
    assignToEmpresa,
    unassignToFactoring,
    unassignToEmpresa,
  };
};
