import type { Factura, FacturaGrupo } from "../types/factura";

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

export const TOOLTIP_FACTURA_EN_GRUPO_ENVIAR =
  "Esta acción no está disponible. La factura pertenece a un grupo y debe enviarse desde el grupo.";

export const TOOLTIP_FACTURA_EN_GRUPO_QUITAR =
  "Esta acción no está disponible. La factura pertenece a un grupo y debe quitarse desde el grupo.";

export const isFacturaInGrupo = (factura?: Factura | null) =>
  Boolean(factura?.facturaGrupoId);

export const isFacturaCargada = (factura?: Factura | null) =>
  factura?.estado?.toLowerCase() === "cargada";

export const isFacturaInMarketplace = (factura?: Factura | null) => {
  if (!factura?.estado) return false;
  return (
    factura.estado === "EN_MARKETPLACE" || factura.estado === "CON_OFERTAS"
  );
};

export const canEnviarFacturaIndividualACotizar = (
  factura?: Factura | null,
) => isFacturaCargada(factura) && !isFacturaInGrupo(factura);

export const canQuitarFacturaIndividualDelMarketplace = (
  factura?: Factura | null,
) => isFacturaInMarketplace(factura) && !isFacturaInGrupo(factura);
