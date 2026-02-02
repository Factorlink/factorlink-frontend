import { useState } from "react";
import api from "../lib/axios";

type GetFacturasParams = {
  page: number;
  limit: number;
  empresaId: string;
  rutEmisor?: string;
  rutReceptor?: string;
  razonSocialReceptor?: string;
  montoTotal?: number;
  minMontoTotal?: number;
  maxMontoTotal?: number;
  montoNeto?: number;
  minMontoNeto?: number;
  maxMontoNeto?: number;
  detalleIva?: number;
  minDetalleIva?: number;
  maxDetalleIva?: number;
  folio?: string;
  estado?: string;
  sortBy?: string;
  order?: string;
};

type UpdateFacturaPayload = {
  estado?: string;
  facturaNameFile?: string;
  base64Factura?: string;
  plazo?: number;
  montoFinanciar?: number;
};

export const useFacturas = () => {
  const [loading, setLoading] = useState(false);

  const getFacturas = async (params: GetFacturasParams) => {
    try {
      setLoading(true);
      const search = new URLSearchParams();
      search.set("page", String(params.page));
      search.set("limit", String(params.limit));
      search.set("empresaId", params.empresaId);

      if (params.rutEmisor) search.set("rutEmisor", params.rutEmisor);
      if (params.rutReceptor) search.set("rutReceptor", params.rutReceptor);
      if (params.razonSocialReceptor) search.set("razonSocialReceptor", params.razonSocialReceptor);
      if (params.montoTotal) search.set("montoTotal", String(params.montoTotal));
      if (params.minMontoTotal) search.set("minMontoTotal", String(params.minMontoTotal));
      if (params.maxMontoTotal) search.set("maxMontoTotal", String(params.maxMontoTotal));
      if (params.montoNeto) search.set("montoNeto", String(params.montoNeto));
      if (params.minMontoNeto) search.set("minMontoNeto", String(params.minMontoNeto));
      if (params.maxMontoNeto) search.set("maxMontoNeto", String(params.maxMontoNeto));
      if (params.detalleIva) search.set("detalleIva", String(params.detalleIva));
      if (params.minDetalleIva) search.set("minDetalleIva", String(params.minDetalleIva));
      if (params.maxDetalleIva) search.set("maxDetalleIva", String(params.maxDetalleIva));
      if (params.folio) search.set("folio", params.folio);
      if (params.estado) search.set("estado", params.estado);
      if (params.sortBy) search.set("sortBy", params.sortBy);
      if (params.order) search.set("order", params.order);

      const response = await api.get(`facturas?${search.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getFacturaById = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get(`facturas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const syncFacturasSii = async (periodoMes: string, periodoAnho: string, empresaId: string) => {
    try {
      setLoading(true);
      const search = new URLSearchParams();
      search.set("periodoMes", periodoMes);
      search.set("periodoAnho", periodoAnho);
      const response = await api.post(
        `facturas/sync-sii?${search.toString()}`, 
        { empresaId },
      );
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateFactura = async (id: string, data: UpdateFacturaPayload) => {
    try {
      setLoading(true);
      const response = await api.put(`/facturas/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getFacturas,
    getFacturaById,
    syncFacturasSii,
    updateFactura,
  };
};
