import { useState } from "react";
import api from "../lib/axios";
import {
  buildCreateOfertaPayload,
  type OfertaPayloadInput,
} from "../utils/ofertaPayload";
import type {
  ComentarioOferta,
  ComentariosOfertaResponse,
  Oferta,
  RespondOfertaPayload,
  UpdateOfertaPayload,
} from "../types/oferta";

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
    } finally {
      setLoading(false);
    }
  };

  const getOfertaById = async (ofertaId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/ofertas/${ofertaId}`);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const updateOferta = async (
    ofertaId: string,
    payload: UpdateOfertaPayload
  ): Promise<Oferta> => {
    try {
      setLoading(true);
      const response = await api.patch(`/ofertas/${ofertaId}`, payload);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const deleteOferta = async (ofertaId: string): Promise<void> => {
    try {
      setLoading(true);
      await api.delete(`/ofertas/${ofertaId}`);
    } finally {
      setLoading(false);
    }
  };

  const getComentarios = async (
    ofertaId: string
  ): Promise<ComentariosOfertaResponse> => {
    try {
      setLoading(true);
      const response = await api.get(`/ofertas/${ofertaId}/comentarios`);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  /** Canal de comentarios del lado Factoring. */
  const createComentario = async (
    ofertaId: string,
    comentario: string
  ): Promise<ComentarioOferta> => {
    try {
      setLoading(true);
      const response = await api.post(`/ofertas/${ofertaId}/comentarios`, {
        comentario,
      });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const responderOferta = async (
    ofertaId: string,
    payload: RespondOfertaPayload
  ): Promise<Oferta> => {
    try {
      setLoading(true);
      const response = await api.patch(`/ofertas/${ofertaId}/responder`, payload);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Canal de comentarios del lado Empresa. Omite `estado` a propósito: enviarlo
   * aceptaría o rechazaría la oferta si dejó de estar condicionada.
   */
  const comentarEmpresa = async (ofertaId: string, comentarioEmpresa: string) =>
    responderOferta(ofertaId, { comentarioEmpresa });

  return {
    loading,
    createOferta,
    getOfertasByFacturaId,
    getOfertaById,
    updateOferta,
    deleteOferta,
    getComentarios,
    createComentario,
    responderOferta,
    comentarEmpresa,
  };
};
