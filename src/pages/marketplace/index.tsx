import { Box, Typography } from "@mui/material";
import Layout from "../../components/Layout";
import useAuthStore from "../../store/authStore";
import { useCallback, useEffect, useState } from "react";
import { useFacturas } from "../../hooks/useFacturas";
import { useSearchParams } from "react-router-dom";
import type { Factura } from "../../types/factura";
import type { FacturasFiltersValues } from "../../components/Facturas/FacturasFilters";
import { INITIAL_FILTERS } from "../../utils/consts";
import type { Meta } from "../../types/meta";

const Marketplace = () => {
  const { currentRole } = useAuthStore();
  const { loading, getFacturasByFactoringId } = useFacturas();
    const [searchParams, setSearchParams] = useSearchParams();
    const [facturas, setFacturas] = useState<Factura[]>([]);

    const [filters, setFilters] = useState<FacturasFiltersValues>(() => {
        const newFilters = { ...INITIAL_FILTERS };
        (
          Object.keys(INITIAL_FILTERS) as Array<keyof FacturasFiltersValues>
        ).forEach((key) => {
          const value = searchParams.get(key);
          if (value !== null) {
            newFilters[key] = value;
          }
        });
        return newFilters;
      });
    
      const [meta, setMeta] = useState<Meta>(() => ({
        lastPage: 1,
        limit: Number(searchParams.get("limit")) || 10,
        page: Number(searchParams.get("page")) || 1,
        total: 0,
        totalCargada: 0,
        totalCedida: 0,
        totalEnMarketplace: 0,
      }));

  const fetchFacturas = useCallback(
      async (currentFilters: FacturasFiltersValues) => {
        if (!currentRole?.factoringId) return;
  
        const params: Record<string, string | number> = {
          page: meta.page,
          limit: meta.limit,
          factoringId: currentRole.factoringId,
        };
  
        // Add filter params if they have values
        if (currentFilters.rutEmisor) params.rutEmisor = currentFilters.rutEmisor;
        if (currentFilters.rutReceptor)
          params.rutReceptor = currentFilters.rutReceptor;
        if (currentFilters.razonSocialReceptor)
          params.razonSocialReceptor = currentFilters.razonSocialReceptor;
        if (currentFilters.folio) params.folio = currentFilters.folio;
        if (currentFilters.estado) params.estado = currentFilters.estado;
        if (currentFilters.montoTotal)
          params.montoTotal = Number(currentFilters.montoTotal);
        if (currentFilters.minMontoTotal)
          params.minMontoTotal = Number(currentFilters.minMontoTotal);
        if (currentFilters.maxMontoTotal)
          params.maxMontoTotal = Number(currentFilters.maxMontoTotal);
        if (currentFilters.montoNeto)
          params.montoNeto = Number(currentFilters.montoNeto);
        if (currentFilters.minMontoNeto)
          params.minMontoNeto = Number(currentFilters.minMontoNeto);
        if (currentFilters.maxMontoNeto)
          params.maxMontoNeto = Number(currentFilters.maxMontoNeto);
        if (currentFilters.detalleIva)
          params.detalleIva = Number(currentFilters.detalleIva);
        if (currentFilters.minDetalleIva)
          params.minDetalleIva = Number(currentFilters.minDetalleIva);
        if (currentFilters.maxDetalleIva)
          params.maxDetalleIva = Number(currentFilters.maxDetalleIva);
        if (currentFilters.sortBy) params.sortBy = currentFilters.sortBy;
        if (currentFilters.order) params.order = currentFilters.order;
  
        const { data, meta: metaResponse } = await getFacturasByFactoringId(params as any);
        setFacturas(data || []);
        setMeta(metaResponse);
      },
      [currentRole?.factoringId, meta.page, meta.limit],
    );

  useEffect(() => {
      fetchFacturas(filters);
    }, [currentRole?.factoringId, meta.page, meta.limit]);

  return (
    <Layout>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Marketplace
        </Typography>
      </Box>
    </Layout>
  );
};

export default Marketplace;
