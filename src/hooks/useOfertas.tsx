import { useState } from "react";
import api from "../lib/axios";
import {
  buildCreateOfertaPayload,
  type OfertaPayloadInput,
} from "../utils/ofertaPayload";

type GetOfertasParams = {
  orderBy?: string;
  order?: string;
};

export const useOfertas = () => {
  const [loading, setLoading] = useState(false);

  const createOferta = async (data: OfertaPayloadInput) => {
    try {
      setLoading(true);
      const payload = buildCreateOfertaPayload(data);
      const response = await api.post("/ofertas", payload);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getOfertasByFacturaId = async (facturaId: string, params?: GetOfertasParams) => {
    try {
      setLoading(true);
      const search = new URLSearchParams();

      if (params?.orderBy) search.set("orderBy", params.orderBy);
      if (params?.order) search.set("order", params.order);
      
      const response = await api.get(`/ofertas/factura/${facturaId}?${search.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getOfertaById = async (ofertaId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/ofertas/${ofertaId}`);
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
    getOfertaById,
    responderOferta,
  };
};
