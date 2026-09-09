import type { FacturaGrupo } from "../types/factura";

const toMonto = (value: string | number | null | undefined) => {
  const n = typeof value === "string" ? parseFloat(value) : Number(value);
  return Number.isFinite(n) ? n : 0;
};

export const getFacturaGrupoCantidad = (grupo?: FacturaGrupo | null) =>
  grupo?.facturas?.length ?? 0;

export const getFacturaGrupoMontoTotal = (grupo?: FacturaGrupo | null) =>
  (grupo?.facturas ?? []).reduce(
    (sum, factura) => sum + toMonto(factura.montoTotal),
    0,
  );

export const getFacturaGrupoMontoFinanciar = (grupo?: FacturaGrupo | null) =>
  toMonto(grupo?.montoFinanciar);
