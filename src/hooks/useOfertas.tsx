import { useState } from "react";
import api from "../lib/axios";

type CreateOfertaPayload = {
  facturaId: string;
  factoringId: string;
  porcentajeFinanciamiento: number;
  tasa: number;
  montoAdelanto: number;
  fechaExpiracion: string;
  comentario: string;
};

export const useOfertas = () => {
  const [loading, setLoading] = useState(false);

  const createOferta = async (data: CreateOfertaPayload) => {
    try {
      setLoading(true);
      const response = await api.post("/ofertas", data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getOfertasByFacturaId = async (facturaId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/ofertas/factura/${facturaId}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const responderOferta = async (ofertaId: string, estado: "aceptada" | "rechazada", comentarioEmpresa: string) => {
    try {
      setLoading(true);
      const response = await api.patch(`/ofertas/${ofertaId}/responder`, {
        estado,
        comentarioEmpresa,
      });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createOferta,
    getOfertasByFacturaId,
    responderOferta,
  };
};
