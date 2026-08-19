import { useState } from "react";
import api from "../lib/axios";
import type { Factura } from "../types/factura";

export type GetFacturasParams = {
  page: number;
  limit: number;
  empresaId?: string;
  factoringId?: string;
  rutEmisor?: string;
  rutReceptor?: string;
  razonSocialReceptor?: string | string[];
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
  estado?: string | string[];
  sortBy?: string;
  order?: string;
};

export type RazonesSocialesTab = "todos" | "marketplace" | "con_ofertas" | "cedidas";

type UpdateFacturaPayload = {
  estado?: string;
  facturaNameFile?: string;
  base64Factura?: string;
  plazo?: number;
  montoFinanciar?: number;
  facturaNameFilePDF?: string;
  base64FacturaPDF?: string;

};

type SendToMarketplacePayload = {
  visibilidad: string;
  factoringIds: string[];
};

export type UploadFacturaArchivoPayload = {
  nombreArchivo: string;
  archivoBase64: string;
  mimeType: string;
};

const appendParam = (
  search: URLSearchParams,
  key: string,
  value?: string | string[],
) => {
  if (value == null) return;
  const values = (Array.isArray(value) ? value : [value])
    .map((v) => (typeof v === "string" ? v : String(v)))
    .filter((v) => v !== "")
    .filter((v, i, arr) => arr.indexOf(v) === i);
  values.forEach((v) => search.append(key, v));
};

const appendListFilters = (search: URLSearchParams, params: GetFacturasParams) => {
  if (params.rutReceptor) search.set("rutReceptor", params.rutReceptor);
  appendParam(search, "razonSocialReceptor", params.razonSocialReceptor);
  if (params.folio) search.set("folio", params.folio);
};

export const useFacturas = () => {
  const [loading, setLoading] = useState(false);

  const getFacturas = async (params: GetFacturasParams) => {
    try {
      setLoading(true);
      const search = new URLSearchParams();
      search.set("page", String(params.page));
      search.set("limit", String(params.limit));
      search.set("empresaId", params.empresaId || "");

      if (params.rutEmisor) search.set("rutEmisor", params.rutEmisor);
      if (params.rutReceptor) search.set("rutReceptor", params.rutReceptor);
      appendParam(search, "razonSocialReceptor", params.razonSocialReceptor);
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
      appendParam(search, "estado", params.estado);
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

  const getRazonesSociales = async (empresaId: string, tab: RazonesSocialesTab) => {
    try {
      const search = new URLSearchParams();
      search.set("empresaId", empresaId);
      search.set("tab", tab);
      const response = await api.get(`facturas/razones-sociales?${search.toString()}`);
      return (response.data || []) as string[];
    } catch (error) {
      throw error;
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

  const refreshFactura = async (id: string) => {
    try {
      const response = await api.get(`/facturas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteFactura = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.delete(`/facturas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendToMarketplace = async (id: string, payload: SendToMarketplacePayload) => {
    try {
      setLoading(true);
      const response = await api.post(`/facturas/${id}/send-to-marketplace`, payload);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromMarketplace = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.post(`/facturas/${id}/remove-from-marketplace`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const listFromMarketplace = async (params: GetFacturasParams) => {
    try {
      setLoading(true);
      const search = new URLSearchParams();
      search.set("page", String(params.page));
      search.set("limit", String(params.limit));
      search.set("empresaId", params.empresaId || "");
      appendListFilters(search, params);
      appendParam(search, "estado", params.estado);
      if (params.sortBy) search.set("sortBy", params.sortBy);
      if (params.order) search.set("order", params.order);
      
      const response = await api.get(`/facturas/marketplace/list?${search.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getFacturasByFactoringId = async (params: GetFacturasParams) => {
    try {
      setLoading(true);
      const search = new URLSearchParams();
      search.set("page", String(params.page));
      search.set("limit", String(params.limit));
      search.set("factoringId", params.factoringId || "");
      
      if (params.empresaId) search.set("empresaId", params.empresaId || "");
      if (params.rutEmisor) search.set("rutEmisor", params.rutEmisor);
      if (params.rutReceptor) search.set("rutReceptor", params.rutReceptor);
      appendParam(search, "razonSocialReceptor", params.razonSocialReceptor);
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
      appendParam(search, "estado", params.estado);
      if (params.sortBy) search.set("sortBy", params.sortBy);
      if (params.order) search.set("order", params.order);


      const response = await api.get(`facturas/factoring/list?${search.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getFacturaByIdAndFactoringId = async (id: string, factoringId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`facturas/${id}?factoringId=${factoringId}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getFacturasConOfertasByEmpresaId = async (params: GetFacturasParams) => {
    try {
      setLoading(true);
      const search = new URLSearchParams();
      search.set("page", String(params.page));
      search.set("limit", String(params.limit));
      search.set("empresaId", params.empresaId || "");
      appendListFilters(search, params);
      appendParam(search, "estado", params.estado);
      if (params.sortBy) search.set("sortBy", params.sortBy);
      if (params.order) search.set("order", params.order);

      const response = await api.get(`/facturas/marketplace/con-ofertas?${search.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getFacturasCedidasByEmpresaId = async (params: GetFacturasParams) => {
    try {
      setLoading(true);
      const search = new URLSearchParams();
      search.set("page", String(params.page));
      search.set("limit", String(params.limit));
      search.set("empresaId", params.empresaId || "");
      appendListFilters(search, params);
      appendParam(search, "estado", params.estado);
      if (params.sortBy) search.set("sortBy", params.sortBy);
      if (params.order) search.set("order", params.order);

      const response = await api.get(`/facturas/cedidas?${search.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchXMLContent = async (id: string): Promise<Factura> => {
    try {
      setLoading(true);
      const response = await api.post<Factura>(`/facturas/${id}/fetch-xml`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const uploadFacturaArchivo = async (
    facturaId: string,
    payload: UploadFacturaArchivoPayload,
  ) => {
    try {
      setLoading(true);
      const response = await api.post(`/facturas/${facturaId}/archivos`, payload);
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
    getRazonesSociales,
    getFacturaById,
    syncFacturasSii,
    updateFactura,
    refreshFactura,
    deleteFactura,
    sendToMarketplace,
    removeFromMarketplace,
    listFromMarketplace,
    getFacturasByFactoringId,
    getFacturaByIdAndFactoringId,
    getFacturasConOfertasByEmpresaId,
    getFacturasCedidasByEmpresaId,
    fetchXMLContent,
    uploadFacturaArchivo,
  };
};
