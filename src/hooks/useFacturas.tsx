import { useState } from "react";
import api from "../lib/axios";

type GetFacturasParams = {
  page: number;
  limit: number;
  empresaId: string;
  rutEmisor?: string;
  rutReceptor?: string;
  folio?: string;
  estado?: string;
  sortBy?: string;
  order?: string;
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

  return {
    loading,
    getFacturas,
  };
};
