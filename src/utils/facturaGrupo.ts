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

export const TOOLTIP_FACTURA_EN_GRUPO_ELIMINAR =
  "Esta acción no está disponible. La factura pertenece a un grupo y no se puede eliminar de forma individual.";

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

export type FacturaGrupoFactoringDrawerTab =
  | "informacion"
  | "tu_oferta"
  | "historial"
  | "comentarios";

export type FacturaGrupoEmpresaDrawerTab =
  | "informacion"
  | "ofertas"
  | "comentarios";

export type FacturaGrupoDrawerQuery = {
  facturaId?: string | null;
  tab?: string | null;
  ofertaId?: string | null;
};

const appendDrawerQuery = (
  path: string,
  query?: FacturaGrupoDrawerQuery | null,
) => {
  if (!query) return path;
  const params = new URLSearchParams();
  if (query.facturaId) params.set("facturaId", query.facturaId);
  if (query.tab) params.set("tab", query.tab);
  if (query.ofertaId) params.set("ofertaId", query.ofertaId);
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
};

export const getFacturaGrupoFactoringPath = (
  grupoId: string,
  query?: FacturaGrupoDrawerQuery | null,
) => appendDrawerQuery(`/facturas/grupos/${grupoId}/factoring`, query);

export const isFacturaGrupoCargada = (estado?: string | null) =>
  (estado || "").trim().toUpperCase() === "CARGADA";

/** Detalle del grupo; si está CARGADA, va directo a editar. */
export const getFacturaGrupoEmpresaPath = (
  grupoId: string,
  estado?: string | null,
  query?: FacturaGrupoDrawerQuery | null,
) => {
  const base = isFacturaGrupoCargada(estado)
    ? `/facturas/grupos/${grupoId}/editar`
    : `/facturas/grupos/${grupoId}`;
  // Deep-link de drawer solo aplica al detalle (no a editar).
  if (isFacturaGrupoCargada(estado)) return base;
  return appendDrawerQuery(base, query);
};

export type GetFacturaFactoringPathOptions = {
  tab?: string | null;
  ofertaId?: string | null;
};

export const getFacturaFactoringPath = (
  factura: Factura,
  opts?: GetFacturaFactoringPathOptions | null,
) => {
  if (factura.facturaGrupoId) {
    return getFacturaGrupoFactoringPath(factura.facturaGrupoId, {
      facturaId: factura.id,
      tab: opts?.tab,
      ofertaId: opts?.ofertaId,
    });
  }
  const params = new URLSearchParams();
  if (opts?.tab) params.set("tab", opts.tab);
  if (opts?.ofertaId) params.set("ofertaId", opts.ofertaId);
  const qs = params.toString();
  return qs
    ? `/facturas/${factura.id}/factoring?${qs}`
    : `/facturas/${factura.id}/factoring`;
};

/** Mapea tab de detalle individual factoring → tab del drawer de grupo. */
export const mapIndividualFactoringTabToGrupo = (
  tab: string | null | undefined,
): FacturaGrupoFactoringDrawerTab | undefined => {
  if (!tab) return undefined;
  if (tab === "oferta") return "tu_oferta";
  if (tab === "historial") return "historial";
  if (tab === "informacion" || tab === "tu_oferta" || tab === "comentarios") {
    return tab;
  }
  return undefined;
};

export const parseFacturaGrupoFactoringTab = (
  tab: string | null | undefined,
): FacturaGrupoFactoringDrawerTab | null => {
  if (
    tab === "informacion" ||
    tab === "tu_oferta" ||
    tab === "historial" ||
    tab === "comentarios"
  ) {
    return tab;
  }
  return null;
};

export const parseFacturaGrupoEmpresaTab = (
  tab: string | null | undefined,
): FacturaGrupoEmpresaDrawerTab | null => {
  if (tab === "informacion" || tab === "ofertas" || tab === "comentarios") {
    return tab;
  }
  return null;
};
