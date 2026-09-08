import { useState } from "react";
import api from "../lib/axios";
import type {
  CreateFacturaGrupoPayload,
  FacturaGrupo,
} from "../types/factura";

export const useFacturaGrupos = () => {
  const [loading, setLoading] = useState(false);

  const createFacturaGrupo = async (
    payload: CreateFacturaGrupoPayload,
  ): Promise<FacturaGrupo> => {
    try {
      setLoading(true);
      const response = await api.post("/factura-grupos", payload);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createFacturaGrupo,
  };
};
