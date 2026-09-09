import { useState } from "react";
import api from "../lib/axios";
import type {
  CreateFacturaGrupoPayload,
  Factura,
  FacturaGrupo,
  FacturaGrupoVisibilidad,
} from "../types/factura";

export type GetFacturaGruposParams = {
  empresaId: string;
  page: number;
  limit: number;
  sortBy?: string;
  order?: string;
  nombre?: string;
  visibilidad?: FacturaGrupoVisibilidad | string;
  porcentajeFinanciamiento?: number;
  plazo?: number;
};

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

  const getFacturaGrupos = async (params: GetFacturaGruposParams) => {
    try {
      setLoading(true);
      const search = new URLSearchParams();
      search.set("empresaId", params.empresaId);
      search.set("page", String(params.page));
      search.set("limit", String(params.limit));
      if (params.sortBy) search.set("sortBy", params.sortBy);
      if (params.order) search.set("order", params.order);
      if (params.nombre) search.set("nombre", params.nombre);
      if (params.visibilidad) search.set("visibilidad", params.visibilidad);
      if (params.porcentajeFinanciamiento != null) {
        search.set(
          "porcentajeFinanciamiento",
          String(params.porcentajeFinanciamiento),
        );
      }
      if (params.plazo != null) search.set("plazo", String(params.plazo));

      const response = await api.get(`/factura-grupos?${search.toString()}`);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const getFacturaGrupoById = async (id: string): Promise<FacturaGrupo> => {
    try {
      setLoading(true);
      const response = await api.get(`/factura-grupos/${id}`);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const getFacturaGrupoFacturas = async (id: string): Promise<Factura[]> => {
    try {
      setLoading(true);
      const response = await api.get(`/factura-grupos/${id}/facturas`);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const sendFacturaGrupoToMarketplace = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.post(
        `/factura-grupos/${id}/send-to-marketplace`,
      );
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const removeFacturaGrupoFromMarketplace = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.post(
        `/factura-grupos/${id}/remove-from-marketplace`,
      );
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const deleteFacturaGrupo = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.delete(`/factura-grupos/${id}`);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createFacturaGrupo,
    getFacturaGrupos,
    getFacturaGrupoById,
    getFacturaGrupoFacturas,
    sendFacturaGrupoToMarketplace,
    removeFacturaGrupoFromMarketplace,
    deleteFacturaGrupo,
  };
};
