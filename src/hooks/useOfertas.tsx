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

  return {
    loading,
    createOferta,
  };
};
